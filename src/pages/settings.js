import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { TitleCard, PageCard, DisableCover } from '../components/common.js';
import { fetchAuthRequest } from '../redux/authSlice.js';
import {
  InventorySelector, SingleCategorySelector, SinglePartSelector,
} from '../components/selectors.js';
import { selectAuxiliaryParts, selectPartTypeCategories } from '../redux/inventorySlice.js';
import {
  useGetAllParts,
  useSetPartTypeCategories,
  useSetAuxiliaryParts,
  useGetAllCategories
} from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { CreateButton, EditButton } from '../components/buttons.js';
import { ObjectForm } from '../components/object-form.js';
import { SelectorLoader } from '../redux/loader.js';
import { LoadingIcon } from '../components/loading.js';
import { ResultIndicator } from '../components/result.js';
import { WithdrawAuxiliaryPartsCheckbox } from '../components/forms/checkboxes.js';

const InventorySelectorStyle = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
const DisableCoverStyle = styled.div`
  color: #fff;
  font-weight: bold;
  font-size: x-large;
`

function InventorySettings() {
  return (
    <PageCard style={{position: "relative"}}>
      <InventorySelectorStyle>
        <h3>Inventory Settings:</h3>
        <div>
          Inventory:
          <InventorySelector/>
          <CreateButton/>
          <EditButton style={{marginLeft: 5}}/>
        </div>
        <div>
          Create Inventory:
          <button className="btn btn-primary" style={{marginLeft: 10}}>
            <MdAdd size={30} color="white"/>
          </button>
        </div>
      </InventorySelectorStyle>
      <DisableCover>
        <DisableCoverStyle>
          <BsExclamationTriangleFill size={40}/>
          Under Construction
          <BsExclamationTriangleFill size={40}/>
        </DisableCoverStyle>
      </DisableCover>
    </PageCard>
  )
}

function PartTypeCategorySelectorForm({categories, partTypeCategories}) {
  const dispatch = useDispatch();
  const useMakeSubmitFn = (options) => 
    useSetPartTypeCategories(
      {...options, onSuccess: () => {
        dispatch(fetchAuthRequest());
      }}
    );

  const getStateFromId = ({categories, id}) => {
    if (id === undefined) {
      return
    }
    let category = categories.filter(c => c._id === id)[0];
    return ({value: category._id, label: category.name})
  }
  const getPTCState = (key, label) => ({
    key, label,
    initialState: getStateFromId({categories, id: partTypeCategories?.[key]}),
    component: SingleCategorySelector,
    formatFn: c => c.value,
  })
  const stateList = [
    ["wheel", "Wheel Category"],
    ["truck", "Truck Category"],
    ["deck", "Deck Category"],
    ["grip", "Grip Category"],
  ].map(item => getPTCState(...item));
  return (
    <ObjectForm {...{
      useMakeSubmitFn, stateList, 
      buttonText: "Save", formStyle: {marginTop: 25}
    }}>
      <h3 style={{position: "absolute", top: 0}}>Part Type Categories</h3>
      <div style={{maxWidth: 400}}>
        * Select the categories that contain all of the parts of the type on the
        left. This will limit your part selection when building complete sets.
      </div>
    </ObjectForm>
  );
}

function PartTypeSettings() {
  const allCategories = useGetAllCategories();
  return (
    <SelectorLoader selectorFn={selectPartTypeCategories} propName="partTypeCategories" pageCard>
      <QueryLoader query={allCategories} propName="categories">
        <PartTypeCategorySelectorForm/>
      </QueryLoader>
    </SelectorLoader>
  )
}

const APFormStyle = styled.div`
  & > .count-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    & > * {
      margin-right: 20px;
    } 
  }
  & > form {
    display: flex;
    flex-direction: column;
    & > button {
      max-width: 100px;
      align-self: center;
      justify-self: center;
      margin-top: 20px;
    }
    & > div {
      display: flex;
      flex-direction: row;
      margin-top: 15px;
      & > div {
        margin-left: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        & > * {
          margin-left: 10px;
        }
      }
      & > button {
        margin-left: 10px;
        background-color: transparent;
        color: black;
        border: 0 solid transparent;
      }
    }
  }
`

/*
 * auxiliaryParts: [[#, partId], ...]
 */
function LoadedAuxiliaryPartSettings({auxiliaryParts, parts}) {
  const getPartName = (id) => parts.filter(p => p._id === id)?.[0]?.name
  const formatAP = (aps) => aps.map(ap => [ap[0], {value: ap[1], label: getPartName(ap[1])}]);
  const [formState, setFormState] = useState(
    auxiliaryParts ? formatAP(auxiliaryParts) : [[1, undefined]]
  );
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(undefined);
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => {
        setSubmissionResult(undefined);
      },
      (submissionResult ? 1000 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);
  const dispatch = useDispatch();
  const submitFn = useSetAuxiliaryParts({
    onSettled: result => {
      setSubmitting(false);
      setSubmissionResult(result.ok && result.status === 201);
    }, 
    onSuccess: () => dispatch(fetchAuthRequest()),
  });
  const onSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    submitFn(formState.map(([quantity, part]) => [Number(quantity), part.value]));
  }
  const increaseFormCount = () => setFormState([...formState, [1, undefined]])
  return (
    <PageCard style={{position: "relative"}}>
      <APFormStyle>
        <div className="count-row">
          <button className="btn btn-secondary" onClick={increaseFormCount}>
            Add Part
          </button>
          <h3>Auxiliary Part Settings</h3>
          <div/>
        </div>
        <form onSubmit={onSubmit}>
          {formState.map((state, index) => (
            <div key={index}>
              <div>
                <label htmlFor={"quantity-" + index}>Quantity:</label>
                <input
                  type="number" name={"quantity-" + index}
                  className="form-control" value={state[0]}
                  onChange={e => setFormState([].concat(
                    formState.slice(0, index),
                    [[e.target.value, state[1]]],
                    formState.slice(index+1)
                  ))} style={{maxWidth: 70}}
                />
              </div>
              <div>
                <label htmlFor={"part-" + index}>Part:</label>
                <SinglePartSelector state={[
                  state[1],
                  v => setFormState([].concat(
                    formState.slice(0, index),
                    [[state[0], v]],
                    formState.slice(index+1)
                  )),
                ]}/>
              </div>
              <button className="btn btn-secondary"
                onClick={() => {
                  setFormState([].concat(
                    formState.slice(0, index), formState.slice(index + 1)
                  ));
                }
              }>
                <TiDeleteOutline size={25}/>
              </button>
            </div>
          ))}
          <button className="btn btn-primary" onClick={onSubmit} type="submit">Save</button>
        </form>
      </APFormStyle>
      {(submitting || (submissionResult !== undefined)) &&
        <DisableCover>
          {submitting && <LoadingIcon size={50} color="white"/>}
          {(submissionResult !== undefined) && 
            <ResultIndicator dark result={submissionResult}/>
          }
        </DisableCover>
      }
      <div style={{maxWidth: 530}}>
        * These parts will be withdrawn and deposited with every Complete Set,
        unless the "Withdraw Auxiliary Parts" setting is disabled.
      </div>
      <WithdrawAuxiliaryPartsCheckbox/>
    </PageCard>
  )
}

function AuxiliaryPartSettings() {
  const allParts = useGetAllParts();
  return (
    <SelectorLoader selectorFn={selectAuxiliaryParts} propName="auxiliaryParts" pageCard>
      <QueryLoader query={allParts} propName="parts">
        <LoadedAuxiliaryPartSettings/>
      </QueryLoader>
    </SelectorLoader>
  );
}

export default function SettingsPage() {
  return (
    <div className="page">
      <TitleCard title="StockTracker Settings"/>
      <InventorySettings/>
      <PartTypeSettings/>
      <AuxiliaryPartSettings/>
    </div>
  )
}
