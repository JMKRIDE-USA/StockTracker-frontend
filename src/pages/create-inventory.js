import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import {
  useGetInventory, useCreateInventory, usePatchInventory, useDeleteInventory,
} from '../modules/inventory.js';
import { ObjectForm, QueryLoader, TitleCard, BackButton, DeleteButton } from 'jeffdude-frontend-helpers';


const getStateList = (inventory) => ([
  {
    key: "name", label: "Name",
    initialState: inventory ? inventory.name : "",
    component: (props) => (
      <input
        type="text" name="name"
        className="form-control" placeholder="New Inventory" 
        {...props}
      />
    ),
    formatFn: _=>_,
  },
  {
    key: "description", label: "Description",
    initialState: inventory ? inventory.description : "",
    component: (props) => (
      <input
        type="text" name="description"
        className="form-control" placeholder="Inventory Description" 
        {...props}
      />
    ),
    formatFn: _=>_,
  },
])

function InventoryCreationForm(){
  const useMakeSubmitFn = (options) =>
    useCreateInventory(options);
  let stateList = getStateList()
  return (
    <ObjectForm
      useMakeSubmitFn={useMakeSubmitFn}
      buttonText="Submit"
      stateList={stateList}
    />
  )
}

function LoadedInventoryEditForm({inventory}){
  const useMakeSubmitFn = (options) =>
    usePatchInventory(inventory._id, options);
  let stateList = getStateList(inventory);
  const history = useHistory();
  const backToSettings  = useCallback(
    () => history.push('/settings'),
    [history],
  )
  const useMakeDeleteFn = (options) =>
    useDeleteInventory(inventory._id, options);
  return (
    <ObjectForm
      buttonText="Save"
      formStyle={{marginTop: 20}}
      {...{useMakeSubmitFn, stateList}}
    >
      <BackButton onClick={backToSettings}/>
      <DeleteButton useMakeSubmitFn={useMakeDeleteFn} onSuccess={backToSettings}/>
    </ObjectForm>
  )
}

const InventoryEditForm = ({id}) => {
  const inventoryQuery = useGetInventory(id);
  return (
    <QueryLoader pageCard query={inventoryQuery} propName="inventory">
      <LoadedInventoryEditForm/>
    </QueryLoader>
  );
}

export default function CreateInventoryPage() {
  const { id } = useParams();
  return (
    <div className="page">
      <TitleCard title={id ? "Edit Inventory" : "Create Inventory"}/>
      {id 
        ? <InventoryEditForm id={id}/>
        : <InventoryCreationForm/>
      }
    </div>
  );
}
