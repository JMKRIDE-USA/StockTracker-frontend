import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { fetchAuthRequest } from '../../redux/authSlice.js'
import { SelectorLoader } from '../../redux/loader.js';
import { selectWithdrawAuxiliaryParts } from '../../redux/inventorySlice.js';
import { useSetWithdrawAuxiliary } from '../../modules/inventory.js'
import { LoadingIcon } from '../../components/loading.js';
import { ResultIndicator } from '../../components/result.js';


const WAPStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  & > * {
    margin-right: 10px;
  }
  & > input {
    height: 20px;
    width: 20px;
  }
`

function LoadedWAPCheckbox({withdrawAuxiliaryParts}) {
  const [checked, setChecked] = useState(withdrawAuxiliaryParts)
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
  const setWAP = useSetWithdrawAuxiliary({
    onSettled: result => {
      setSubmitting(false);
      setSubmissionResult(result.ok && result.status === 201);
    }, 
    onSuccess: () => dispatch(fetchAuthRequest()),
  })
  const onChange = e => {
    setSubmitting(true);
    setChecked(e.target.checked);
    setWAP(e.target.checked);
  }
  return (
    <WAPStyle>
      <label htmlFor="WAP">Withdraw Auxiliary Parts:</label>
      <input type="checkbox" name="WAP" checked={checked} onChange={onChange}/>
      {(submitting || (submissionResult !== undefined)) &&
        <div>
          {submitting && <LoadingIcon size={15} color="black"/>}
          {(submissionResult !== undefined) && 
            <ResultIndicator dark result={submissionResult}/>
          }
        </div>
      }
    </WAPStyle>
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
