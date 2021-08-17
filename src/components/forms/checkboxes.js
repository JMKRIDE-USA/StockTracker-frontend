import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { fetchAuthRequest } from '../../redux/authSlice.js'
import { SelectorLoader } from '../../redux/loader.js';
import { selectDebug, selectWithdrawAuxiliaryParts } from '../../redux/inventorySlice.js';
import { useSetUserSetting } from '../../modules/inventory.js'
import { LoadingIcon } from '../../components/loading.js';
import { ResultIndicator } from '../../components/result.js';


const CheckboxStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  & > * {
    margin-right: 10px;
  }
  & > input {
    height: 25px;
    width: 20px;
  }
  & > .result {
  }
`

function Checkbox({useMakeSubmitFn, initialState, label}) {
  const [checked, setChecked] = useState(initialState)
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
  const submitFn = useMakeSubmitFn({
    onSettled: result => {
      setSubmitting(false);
      setSubmissionResult(result.ok && result.status === 201);
    }, 
    onSuccess: () => dispatch(fetchAuthRequest()),
  })
  const onChange = e => {
    setSubmitting(true);
    setChecked(e.target.checked);
    submitFn(e.target.checked);
  }
  return (
    <CheckboxStyle>
      <label htmlFor="cb">{label}:</label>
      <input type="checkbox" name="cb" checked={checked} onChange={onChange}/>
      {(submitting || (submissionResult !== undefined)) &&
        <div className="result">
          {submitting && <LoadingIcon size={15} color="black"/>}
          {(submissionResult !== undefined) && 
            <ResultIndicator result={submissionResult}/>
          }
        </div>
      }
    </CheckboxStyle>
  )
}

const LoadedWAPCheckbox = ({withdrawAuxiliaryParts}) => {
  const useMakeSubmitFn = (options) => useSetUserSetting(
    'withdrawAuxiliaryParts', options
  );
  return (
    <Checkbox
      useMakeSubmitFn={useMakeSubmitFn}
      initialState={withdrawAuxiliaryParts}
      label={"Withdraw Auxiliary Parts"}
    />
  )
}

export function WithdrawAuxiliaryPartsCheckbox() {
  return (
    <SelectorLoader
      selectorFn={selectWithdrawAuxiliaryParts}
      propName="withdrawAuxiliaryParts"
    >
      <LoadedWAPCheckbox/>
    </SelectorLoader>
  );
}
const LoadedDebugCheckbox = ({debug}) => {
  const useMakeSubmitFn = (options) => 
    useSetUserSetting('debug', options);
  return (
    <Checkbox
      useMakeSubmitFn={useMakeSubmitFn}
      initialState={debug}
      label={"Debug Mode"}
    />
  )
}

export function DebugCheckbox() {
  return (
    <SelectorLoader
      selectorFn={selectDebug}
      propName="debug"
    >
      <LoadedDebugCheckbox/>
    </SelectorLoader>
  );
}
