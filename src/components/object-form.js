import React, { useEffect, useState } from 'react';

import {
  CreateForm, PageCard, DisableCover
} from '../components/common.js';
import { LoadingIcon } from '../components/loading.js';
import { ResultIndicator } from '../components/result.js';


export function ObjectForm({
  useMakeSubmitFn, stateList, buttonText, formStyle={}, children,
}){ 
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
  const submitFn = useMakeSubmitFn({onSettled: result => {
    setSubmitting(false);
    setSubmissionResult(result.ok && result.status === 201);
  }});
  const onSubmit = async e => {
    e.preventDefault();
    let submissionData = {};
    stateList.forEach(item => submissionData[item.key] = item.formatFn(item.state[0]))
    setSubmitting(true);
    return await submitFn(submissionData);
  }
  return (
    <PageCard style={{position: "relative"}}>
      <CreateForm style={formStyle}>
        <form onSubmit={onSubmit}>
          { stateList.map(item => (
            <div key={item.key}>
              <label htmlFor={item.key}>{item.label}:</label>
              {item.component({
                state: item.state, value: item.state[0],
                id: item.key, onChange: e => item.state[1](e.target.value),
                style: item.componentStyle ? item.componentStyle : {},
              })}
            </div>
          ))}
          <button className="btn btn-primary" type="submit">
            {buttonText}
          </button>
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
