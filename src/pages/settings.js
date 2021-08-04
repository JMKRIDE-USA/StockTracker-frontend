import React, { useState } from 'react';

import styled from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';

import { TitleCard, PageCard, DisableCover } from '../components/common.js';
import { setPartTypeCategories } from '../redux/inventorySlice.js';
import { InventorySelector, SingleCategorySelector } from '../components/selectors.js';
import { selectPartTypeCategories } from '../redux/inventorySlice.js';
import { useSetPartTypeCategories, useGetAllCategories } from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { CreateButton, EditButton } from '../components/buttons.js';
import { ObjectForm } from '../components/object-form.js';
import { LoadingIcon } from '../components/loading.js';

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

const getStateFromId = ({categories, id}) => {
  if (id === undefined) {
    return
  }
  let category = categories.filter(c => c._id === id)[0];
  return ({value: category._id, label: category.name})
}

const useGetStateList = ({categories, partTypeCategories}) => ([
  {
    key: "wheel", label: "Wheel Category",
    state: useState(getStateFromId({categories, id: partTypeCategories?.wheel})),
    component: SingleCategorySelector,
    formatFn: c => c.value,
  },
  {
    key: "truck", label: "Truck Category",
    state: useState(getStateFromId({categories, id: partTypeCategories?.truck})),
    component: SingleCategorySelector,
    formatFn: c => c.value,
  },
  {
    key: "deck", label: "Deck Category",
    state: useState(getStateFromId({categories, id: partTypeCategories?.deck})),
    component: SingleCategorySelector,
    formatFn: c => c.value,
  },
  {
    key: "grip", label: "Grip Category",
    state: useState(getStateFromId({categories, id: partTypeCategories?.grip})),
    component: SingleCategorySelector,
    formatFn: c => c.value,
  },
])
  

function PartTypeCategorySelectorForm({categories, partTypeCategories}) {
  const dispatch = useDispatch();
  const useMakeSubmitFn = (options) => 
    useSetPartTypeCategories(
      {...options, onSuccess: ({data}) => {
        console.log(data);
        dispatch(setPartTypeCategories(data));
      }}
    );
  const stateList = useGetStateList({categories, partTypeCategories});
  return (
    <ObjectForm {...{
      useMakeSubmitFn, stateList, 
      buttonText: "Save", formStyle: {marginTop: 25}
    }}>
      <h3 style={{position: "absolute", top: 0}}>Part Type Categories</h3>
    </ObjectForm>
  );
}

function PartTypeSettings() {
  const allCategories = useGetAllCategories();
  const partTypeCategories = useSelector(selectPartTypeCategories);
  if(partTypeCategories === undefined) { // stupid redux...
    return <PageCard><LoadingIcon size={40}/></PageCard>;
  }
  return (
    <QueryLoader query={allCategories} propName="categories">
      <PartTypeCategorySelectorForm partTypeCategories={partTypeCategories}/>
    </QueryLoader>
  )
}

export default function SettingsPage() {
  return (
    <div className="page">
      <TitleCard title="StockTracker Settings"/>
      <InventorySettings/>
      <PartTypeSettings/>
    </div>
  )
}
