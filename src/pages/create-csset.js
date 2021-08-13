import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { TitleCard } from '../components/common.js';
import { BackButton, DeleteButton } from '../components/buttons.js';
import { MultiCSSelector } from '../components/selectors.js';
import { 
  useCreateCSSet, useGetCSSetById, useGetAllCS, usePatchCSSet, useDeleteCSSet
} from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { ObjectForm } from '../components/object-form.js';


const getStateList = ({CSSet, completeSets} = {}) => ([
  {
    key: "name", label: "Name",
    initialState: CSSet ? CSSet.name : "",
    component: (props) => (
      <input
        type="text" name="name"
        className="form-control" placeholder="New CS Set" 
        {...props}
      />
    ),
    formatFn: _=>_,
  },
  {
    key: "CSIds", label: "Complete Sets",
    initialState: (completeSets 
      ? completeSets.map(cs => ({value: cs._id, label: cs.name}))
      : []
    ),
    component: MultiCSSelector, formatFn: CSs => CSs.map(c => c.value),
  },
])

function CreateCSSetCard() {
  const stateList = getStateList();
  const useMakeSubmitFn = (options) =>
    useCreateCSSet(options);

  return <ObjectForm {...{stateList, useMakeSubmitFn, buttonText: "Submit"}}/>
}

function EditCSSetCard({CSSet, completeSets}) {
  const stateList = getStateList({CSSet, completeSets});
  const useMakeSubmitFn = (options) =>
    usePatchCSSet(CSSet._id, options);


  const history = useHistory();
  const backToCompleteSets = useCallback(
    () => history.push('/completeset'),
    [history],
  )
  const deleteCSSet = useDeleteCSSet(CSSet._id);
  const onClickDelete = () => {
    deleteCSSet();
    backToCompleteSets();
  }

  return (
    <ObjectForm {...{stateList, useMakeSubmitFn, buttonText: "Submit"}}>
      <BackButton onClick={backToCompleteSets}/>
      <DeleteButton onClick={onClickDelete}/>
    </ObjectForm>
  );
}

function CSSetLoader({id, children}) {
  const CSSetQuery = useGetCSSetById(id);
  const completeSetsQuery = useGetAllCS({CSSet: id});
  return (
    <QueryLoader query={CSSetQuery} propName="CSSet">
      <QueryLoader query={completeSetsQuery} propName="completeSets">
        {children}
      </QueryLoader>
    </QueryLoader>
  )
}

export default function CreateCSSet() {
  const { id } = useParams();
  return (
    <div className="page">
      <TitleCard title={id ? "Edit CS Set" : "Create CS Set"}/>
      {id ? <CSSetLoader id={id}><EditCSSetCard/></CSSetLoader> : <CreateCSSetCard/> }
    </div>
  );
}
