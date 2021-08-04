import React, { useState, useEffect, useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { TitleCard, PageCard, CreateForm, DisableCover } from '../components/common.js';
import { BackButton, DeleteButton } from '../components/buttons.js';
import { MultiCSSelector } from '../components/selectors.js';
import { 
  useCreateCSSet, useGetCSSetById, useGetAllCS, usePatchCSSet, useDeleteCSSet
} from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { LoadingIcon } from '../components/loading.js';
import { ResultIndicator } from '../components/result.js';


function CSSetForm({nameState, completeSetsState, makeSubmitFn, children}) {
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(undefined);
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => setSubmissionResult(undefined),
      (submissionResult ? 1000 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);
  const submitFn = makeSubmitFn({onSettled: result => {
      setSubmitting(false);
      setSubmissionResult(result.ok && result.status === 201);
    }}
  );
  const [name, setName] = nameState;

  const onSubmit = async e => {
    e.preventDefault();
    let CSSetData = {
      name, CSIds: completeSetsState[0].map(c => c.value),
    }
    setSubmitting(true);
    await submitFn(CSSetData);
  }

  return (
    <PageCard style={{position: "relative"}}>
      <CreateForm style={{marginTop: children ? 20 : 0}}>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              className="form-control" type="text" name="name"
              value={name} onChange={e => setName(e.target.value)}
              placeholder="New CS Set"
            />
          </div>
          <div>
            <label htmlFor="CSSelector">Complete Sets:</label>
            <MultiCSSelector state={completeSetsState} id="CSSelector"/>
          </div>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </CreateForm>
      {(submitting || (submissionResult !== undefined)) &&
        <DisableCover>
          {submitting && <LoadingIcon size={50} color="white"/>}
          {(submissionResult !== undefined) && 
            <ResultIndicator dark result={submissionResult}/>
          }
        </DisableCover>
      }
      {children}
    </PageCard>
  );
}

function CreateCSSetCard() {
  const nameState = useState("")
  const completeSetsState = useState([]);
  const useMakeSubmitFn = (options) =>
    useCreateCSSet(options);

  return <CSSetForm 
    {...{nameState, completeSetsState, makeSubmitFn: useMakeSubmitFn}}
  />
}

function EditCSSetCard({CSSet, completeSets}) {
  const nameState = useState(CSSet.name)
  const completeSetsState = useState(
    completeSets.map(cs => ({value: cs._id, label: cs.name}))
  );
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
    <CSSetForm 
      {...{nameState, completeSetsState, makeSubmitFn: useMakeSubmitFn}}
    >
      <BackButton onClick={backToCompleteSets}/>
      <DeleteButton onClick={onClickDelete}/>
    </CSSetForm>
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
