import React, { useCallback } from 'react';

import { useParams, useHistory } from 'react-router-dom';

import { useGetStateList, FakeCompleteSetIcon } from '../components/completeset-form.js';
import { TitleCard } from '../components/common.js';
import { BackButton, DeleteButton } from '../components/buttons.js';
import { ObjectForm } from '../components/object-form.js';
import { QueryLoader } from '../modules/data.js';
import {
  useCreateCompleteSet, usePatchCompleteSet, useGetCSById, useDeleteCS, useGetAllParts,
} from '../modules/inventory.js';



function CompleteSetCreationForm() {
  const useMakeSubmitFn = (options) => 
    useCreateCompleteSet(options)
  const stateList = useGetStateList()
  const allPartsQuery = useGetAllParts();
  return (
    <ObjectForm {...{
      useMakeSubmitFn, stateList,
      buttonText: "Submit", formStyle: {marginTop: 100}
    }}>
      <QueryLoader query={allPartsQuery} propName="parts">
        <FakeCompleteSetIcon stateList={stateList}/>
      </QueryLoader>
    </ObjectForm>
  );
}

function CompleteSetEditForm({completeSet}) {
  const history = useHistory();
  const backToCompleteSets = useCallback(
    () => history.push('/completeset'),
    [history],
  )
  const deleteCS = useDeleteCS(completeSet._id);
  const onClickDelete = () => {
    deleteCS();
    backToCompleteSets();
  }
  const useMakeSubmitFn = (options) => 
    usePatchCompleteSet(completeSet._id, options)
  const stateList = useGetStateList({completeSet});
  const allPartsQuery = useGetAllParts();
  return (
    <ObjectForm {...{
      useMakeSubmitFn, stateList, buttonText: "Save", formStyle: {marginTop: 100},
    }}>
      <BackButton onClick={backToCompleteSets}/>
      <DeleteButton onClick={onClickDelete}/>
      <QueryLoader query={allPartsQuery} propName="parts">
        <FakeCompleteSetIcon stateList={stateList}/>
      </QueryLoader>
    </ObjectForm>
  );
}

function CompleteSetEditWrapper({id}) {
  const completeSetId = useGetCSById(id);
  return (
    <QueryLoader query={completeSetId} propName="completeSet">
      <CompleteSetEditForm/>
    </QueryLoader>
  );
}

export default function CreateCompleteSet() {
  const { id } = useParams();
  return (
    <div className="page">
      <TitleCard title={id ? "Edit Complete Set" : "Create Complete Set"}/>
      {id ? <CompleteSetEditWrapper id={id}/> : <CompleteSetCreationForm/>}
    </div>
  );
}
