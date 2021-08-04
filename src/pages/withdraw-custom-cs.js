import React, { useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { TitleCard } from '../components/common.js';
import { BackButton } from '../components/buttons.js';
import { QueryLoader } from '../modules/data.js';
import { 
  useGetStateList, FakeCompleteSetIcon
} from '../components/completeset-form.js';
import { ObjectForm } from '../components/object-form.js';
import { useWithdrawCustomCompleteSet, useGetAllParts } from '../modules/inventory.js';

export default function WithdrawCustomSetPage() {
  const partsState = useGetStateList({temporary: true})
  const stateList = [
    {
      key: "quantity", label: "Amount of Sets",
      state: useState(1),
      component: (props) => (
        <input
          type="number" name="quantity"
          className="form-control" 
          {...props}
        />
      ),
      formatFn: _=>_,
      componentStyle: {maxWidth: 100},
    },
  ].concat(partsState)
  const useMakeSubmitFn = (options) => useWithdrawCustomCompleteSet(options);
  const allPartsQuery = useGetAllParts()
  const history = useHistory()
  const backToCompleteSet = useCallback(
    () => history.push('/completeset'),
    [history],
  )
  return (
    <div className="page">
      <TitleCard title="Withdraw Custom Complete Set"/>
      <ObjectForm {...{
        useMakeSubmitFn, stateList, buttonText: "Submit",
        formStyle: {marginTop: 100}
      }}>
        <QueryLoader query={allPartsQuery} propName="parts">
          <FakeCompleteSetIcon {...{stateList, position: "top"}}/>
        </QueryLoader>
        <BackButton onClick={backToCompleteSet}/>
      </ObjectForm>
    </div>
  );
}
