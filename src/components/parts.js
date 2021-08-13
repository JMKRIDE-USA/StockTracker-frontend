import React, { useCallback, useState, useEffect } from 'react';

import { HiXCircle } from 'react-icons/hi';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { QueryLoader } from '../modules/data.js';
import { colorNameToHex, colorIsDark } from '../constants.js';
import {
  useGetPart,
  useAdjustPartQuantity,
  useAdjustCompleteSetQuantity,
} from '../modules/inventory.js';
import { LoadingText } from './loading.js';
import { ResultIndicator } from './result.js';


const AdjustmentForm = styled.div`
  form {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    & > input {
      max-width: 50px;
      margin-left: 7px;
      margin-right: 7px;
    }
    & > button {
      border-color: black;
    }
  }
`
function AmountAdjustmentForm({
  adjustAmountFn,
  submitting,
  setSubmitting,
  submissionResult,
  setSubmissionResult,
  negateQuantity,
  quantityAllowed,
  buttonStyle,
  id,
}) {
  const [amount, setAmount] = useState(0);
  const submitAdjustment = async (event) => {
    event.preventDefault();
    const quantity = (negateQuantity 
      ? -event.target?.[0].valueAsNumber
      : event.target?.[0].valueAsNumber
    );
    const { allowed, reason } = quantityAllowed(quantity);
    if(!allowed) {
      console.log("[!] Quantity not allowed: " + reason);
      setSubmissionResult(false);
    } else if(quantity !== 0) {
      setSubmitting(true);
      await adjustAmountFn({quantity});
    }
    setAmount(0);
  }
  const inputId = negateQuantity ? id + "amount-input-1" : id + "amount-input-2";
  const label = negateQuantity ? "Withdraw" : "Deposit";
  return (
    <AdjustmentForm>
      <form className="form-group" onSubmit={submitAdjustment}>
        <label htmlFor={inputId}>{label}:</label>
        <input
          id={ inputId }
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitting}
          style={buttonStyle}        
        >
          Submit
        </button>
        {submitting ? <LoadingText/> : ''}
        {submissionResult !== undefined ? <ResultIndicator result={submissionResult}/> : ''}
      </form>
    </AdjustmentForm>
  );
}

const CompleteSetAdjustmentForm = ({completeSet, ...props}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState();
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => setSubmissionResult(undefined),
      (submissionResult ? 1000 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);
  const adjustQuantity = useAdjustCompleteSetQuantity(
    {completeSetId: completeSet._id},
    {onSettled: (result) => {
      setSubmitting(false);
      setSubmissionResult(result.ok && result.status === 201);
    }},
  );
  return AmountAdjustmentForm({
    adjustAmountFn: adjustQuantity,
    submitting, setSubmitting,
    submissionResult, setSubmissionResult,
    buttonStyle: {
      backgroundColor: colorNameToHex(completeSet.color),
      color: colorIsDark(completeSet.color) ? "white" : "black",
    },
    id: completeSet._id,
    ...props
  });
}

export const CompleteSetWithdrawalForm = ({completeSet}) => (
  <CompleteSetAdjustmentForm
    completeSet={completeSet}
    negateQuantity={true}
    quantityAllowed={quantity => {
      if(quantity > 0) {
        return {
          allowed: false,
          reason: "No deposits from the complete set withdrawal form!",
        };
      }
      return {allowed: true, reason: ""};
    }}
  />
);

export const CompleteSetDepositForm = ({completeSet}) => (
  <CompleteSetAdjustmentForm
    completeSet={completeSet}
    negateQuantity={false}
    quantityAllowed={quantity => {
      if(quantity < 0) {
        return {
          allowed: false,
          reason: "No withdrawal from the complete set deposit form!",
        };
      }
      return {allowed: true, reason: ""};
    }}
  />
);

const PartAdjustmentForm = ({part, ...props}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState();
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => setSubmissionResult(undefined),
      (submissionResult ? 1000 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);
  const adjustQuantity = useAdjustPartQuantity(
    {partId: part._id},
    {onSettled: (result) => {
      setSubmitting(false);
      setSubmissionResult(result.ok && result.status === 201);
    }},
  );

  return AmountAdjustmentForm({
    adjustAmountFn: adjustQuantity,
    submitting, setSubmitting,
    submissionResult, setSubmissionResult,
    buttonStyle: {
      backgroundColor: colorNameToHex(part.color),
      color: colorIsDark(part.color) ? "white" : "black",
    },
    ...props
  });
}

const PartDepositForm = ({part}) => (
  <PartAdjustmentForm
    part={part}
    negateQuantity={false}
    quantityAllowed={quantity => {
      if(quantity < 0) {
        return {
          allowed: false,
          reason: "No withdrawals from the deposit form!",
        };
      }
      return {allowed: true, reason: ""};
    }}
  />
);
const PartWithdrawalForm = ({part}) => (
  <PartAdjustmentForm
    part={part}
    negateQuantity={true}
    quantityAllowed={quantity => {
      if(quantity > 0) {
        return {
          allowed: false,
          reason: "No deposits from the withdrawal form!",
        };
      }
      return {allowed: true, reason: ""};
    }}
  />
);

const PartInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  border: 1px solid black;
  & > * {
    margin: 3px;
  }
  & > .part-info { 
    display: flex;
    flex-direction: row;
    & > * {
      margin-left: 3px;
      margin-right: 3px;
    }
  }
`

function LoadedPartInfoAndControls(
  {part, onClose, partViewButton = true, withdrawEnabled = true, depositEnabled = true}
) {
  const history = useHistory();
  const viewPart = useCallback(
    () => history.push('/part/' + part._id.toString()),
    [history, part]
  )
  return (
    <PartInfoRow>
      <div className="part-info">
        <div className="text-bold">
          Selected:
        </div>
        {part.name}
        <div/>
        <div className="text-bold">
          Quantity:
        </div>
        {part.quantity}
      </div>
      { withdrawEnabled ? <PartWithdrawalForm part={part}/> : ''}
      { depositEnabled ? <PartDepositForm part={part}/> : ''}
      <div className="part-info">
        { partViewButton
          ? <button onClick={viewPart} className="btn btn-secondary">
              View/Edit
            </button>
          : ''
        }
        <button onClick={onClose} className="btn" style={{padding: 0, margin: 0}}>
          <HiXCircle size={30} color={"#6c757d"}/>
        </button>
      </div>
    </PartInfoRow>
  );
}

export function PartInfoAndControls({partId, ...props}){
  const partQuery = useGetPart(partId);
  return (
    <QueryLoader card={false} query={partQuery} propName={"part"}>
      <LoadedPartInfoAndControls {...props}/>
    </QueryLoader>
  );
}
