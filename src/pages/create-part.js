import React, { useState, useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import {
  useGetPart, useCreatePart, usePatchPart, useDeletePart,
} from '../modules/inventory.js';
import { ObjectForm } from '../components/object-form.js';
import { QueryLoader } from '../modules/data.js';
import { TitleCard } from '../components/common.js';
import { BackButton, DeleteButton } from '../components/buttons.js';
import { CategorySelector, ColorSelector } from '../components/selectors.js';


const useGetStateList = (part) => ([
  {
    key: "name", label: "Name",
    state: useState(part ? part.name : ""),
    component: (props) => (
      <input
        type="text" name="name"
        className="form-control" placeholder="New Part" 
        {...props}
      />
    ),
    formatFn: _=>_,
  },
  {
    key: "categoryIds", label: "Category",
    state: useState(part
      ? part.categories.map(c => ({value: c.category._id, label: c.category.name}))
      : []
    ),
    component: CategorySelector,
    formatFn: categories => categories.map(c => c.value),
  },
  {
    key: "color", label: "Color",
    state: useState(part ? {value: part.color, label: part.color} : ""),
    component: ColorSelector, formatFn: c => c.value,
  },
])

function PartCreationForm(){
  const useMakeSubmitFn = (options) =>
    useCreatePart(options)
  let stateList = useGetStateList()
  stateList.push(
    {
      key: "quantity", label: "Starting Quantity",
      state: useState(0), componentStyle: {maxWidth: 80},
      component: (props) => (
        <input className="form-control" type="number" name="quantity" {...props}/>
      ),
      formatFn: _=>_,
    }
  );
  return (
    <ObjectForm
      useMakeSubmitFn={useMakeSubmitFn}
      buttonText="Submit"
      stateList={stateList}
    />
  )
}

function DeletePart({part}) {
  const history = useHistory();
  const toAllParts  = useCallback(
    () => history.push('/part'),
    [history],
  )
  const deletePart = useDeletePart(part._id);
  const onClick = () => {
    deletePart();
    toAllParts();
  }
  return <DeleteButton onClick={onClick}/>
}

function PartEditForm({part}){
  const useMakeSubmitFn = (options) =>
    usePatchPart(part._id, options)
  const stateList = useGetStateList(part);
  const history = useHistory()
  const viewPart  = useCallback(
    () => history.push('/part/' + part._id),
    [history, part._id],
  )
  return (
    <ObjectForm
      useMakeSubmitFn={useMakeSubmitFn}
      buttonText="Submit"
      formStyle={{marginTop: 20}}
      stateList={stateList}
    >
      <BackButton onClick={viewPart}/>
      <DeletePart part={part}/>
    </ObjectForm>
  )
}

function PartLoader({id, children}){
  const partQuery = useGetPart(id);
  return (
    <QueryLoader pageCard query={partQuery} propName="part">
      {children}
    </QueryLoader>
  );
}

export default function CreatePart() {
  const { id } = useParams();
  return (
    <div className="page">
      <TitleCard title={id ? "Edit Part" : "Create Part"}/>
      {id 
        ? <PartLoader id={id}><PartEditForm/></PartLoader>
        : <PartCreationForm/>
      }
    </div>
  );
}
