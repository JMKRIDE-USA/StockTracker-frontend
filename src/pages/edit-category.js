import React, { useEffect, useRef, useState, useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import update from 'immutability-helper';

import { QueryLoader } from '../modules/data.js';
import { LoadingIcon } from '../components/loading.js';
import {
  useGetPartsByCategory,
  useGetCategory,
  useSetCategoryOrder,
} from '../modules/inventory.js';
import { colorNameToHex, colorIsDark } from '../constants.js';
import { ResultIndicator } from '../components/result.js';


const PartComponent = styled.div`
  padding: 10px;
  margin: 5px;
  width: 200px;
  border: 2px dotted black;
`
function Part({ part, id, index, movePart, persistOrder }) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'part',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if(!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top)/2;
      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      movePart(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop() {
      persistOrder()
    }
  });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'part',
    item: {index, id},
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(drop(ref));
  return (
    <PartComponent
      ref={ref}
      data-handler-id={handlerId}
      style={{
        color: colorIsDark(part.color) ? "white" : "black",
        backgroundColor: colorNameToHex(part.color),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {part.name}
    </PartComponent>
  );
}

const DisableCover = styled.div`
  background-color: rgba(52, 52, 52, 0.8);
  border-radius: 7px;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  position: absolute;
  zIndex: 5;
`

function CategoryPartsList({category, parts}) {
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState();
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => {
        if (!submissionResult){
          //janky, but needed to reset everything since local is presumed to be
          //out of sync with server
          window.location.reload();
        };
        setSubmissionResult(undefined);
      },
      (submissionResult ? 0 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);

  const setCategoryOrder = useSetCategoryOrder(
    category._id, 
    {onSettled: result => {
      setSubmitting(false);
      setDirtyOrder(false);
      setSubmissionResult(result.ok && result.status === 200);
    }},
  )
  const formatParts = (partList) => partList.map(
    (part, index) => ({id: part._id, index})
  );
  const history = useHistory();
  const viewCategory = useCallback(
    () => history.push('/category/' + category._id),
    [history, category._id]
  )
  const [partsState, setPartsState] = useState(
    JSON.parse(JSON.stringify(parts))
  );
  const [dirtyOrder, setDirtyOrder] = useState(false);
  const persistOrder = async () => {
    if(!dirtyOrder) {
      return;
    }
    setSubmitting(true);
    await setCategoryOrder({partOrder: formatParts(partsState)});
  }
  const movePart = useCallback((dragIndex, hoverIndex) => {
    const dragPart = partsState[dragIndex];
    setDirtyOrder(true);
    setPartsState(update(partsState, {
      $splice: [
        [dragIndex, 1], // delete dragged element
        [hoverIndex, 0, dragPart], // place dragged element in new location
      ],
    }));
  }, [partsState]);

  return (
    <div
      className="page-card"
      style={{position: "relative", display: "inline-flex"}}
    >
      <div className="flex-column">
        <div className="flex-row">
          <h3>Category: {category.name}</h3>
          <button
            className="btn btn-secondary"
            onClick={viewCategory}
            style={{marginLeft: "20px"}}
          >
            View
          </button>
        </div>
        {partsState.map((part, index) => (
          <Part
            key={part._id}
            id={part._id}
            index={index}
            part={part}
            movePart={movePart}
            persistOrder={persistOrder}
          />
        ))}
      </div>
      {(submitting || (submissionResult !== undefined))
        ? <DisableCover>
            {submitting ? <LoadingIcon size={30} color={"white"}/> : ''}
            {submissionResult !== undefined 
              ? <ResultIndicator dark={true} result={submissionResult}/> 
              : ''
            }
          </DisableCover> 
        : ''
      }
    </div>
  );
}

export default function EditCategoryPage() {
  const { id } = useParams();
  const categoryPartsQuery = useGetPartsByCategory(id, { noQuantity: true });
  const categoryQuery = useGetCategory(id);
  return (
    <div className="page">
      <QueryLoader query={categoryQuery} propName={"category"}>
        <QueryLoader query={categoryPartsQuery} propName={"parts"}>
            <CategoryPartsList/>
        </QueryLoader>
      </QueryLoader>
    </div>
  );
}
