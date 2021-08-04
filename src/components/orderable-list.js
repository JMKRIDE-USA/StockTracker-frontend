import React, { useEffect, useRef, useState, useCallback } from 'react';

import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import update from 'immutability-helper';

import { ResultIndicator } from '../components/result.js';
import { colorNameToHex, colorIsDark } from '../constants.js';
import { DisableCover } from '../components/common.js';
import { LoadingIcon } from '../components/loading.js';


const ItemComponent = styled.div`
  padding: 10px;
  margin: 5px;
  width: 200px;
  border: 2px dotted black;
`
function Item({ item, id, index, movePart, persistOrder }) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'item',
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
    type: 'item',
    item: {index, id},
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(drop(ref));
  return (
    <ItemComponent
      ref={ref}
      data-handler-id={handlerId}
      style={{
        color: colorIsDark(item.color) ? "white" : "black",
        backgroundColor: colorNameToHex(item.color),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item.name}
    </ItemComponent>
  );
}

export function OrderableList({makeReorderFn, items, children, topMargin }) {
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
      (submissionResult ? 1000 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);
  const reorderFn = makeReorderFn({
    onSettled: result => {
      setSubmitting(false);
      setDirtyOrder(false);
      setSubmissionResult(result.ok && result.status === 200);
    }},
  )
  const formatItems = (itemList) => itemList.map(
    (item, index) => ({id: item._id, index})
  );
  const [groupState, setGroupState] = useState(
    JSON.parse(JSON.stringify(items))
  );
  const [dirtyOrder, setDirtyOrder] = useState(false);
  const persistOrder = async () => {
    if(!dirtyOrder) {
      return;
    }
    setSubmitting(true);
    await reorderFn({itemOrder: formatItems(groupState)});
  }
  const moveItem = useCallback((dragIndex, hoverIndex) => {
    const dragItem = groupState[dragIndex];
    setDirtyOrder(true);
    setGroupState(update(groupState, {
      $splice: [
        [dragIndex, 1], // delete dragged element
        [hoverIndex, 0, dragItem], // place dragged element in new location
      ],
    }));
  }, [groupState]);

  return (
    <div
      className="page-card"
      style={{position: "relative", display: "inline-flex"}}
    >
      {topMargin && <div style={{marginTop: 20}}/>}
      { children }
      <div className="flex-column">
        {groupState.map((item, index) => (
          <Item
            key={item._id}
            id={item._id}
            index={index}
            item={item}
            movePart={moveItem}
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
