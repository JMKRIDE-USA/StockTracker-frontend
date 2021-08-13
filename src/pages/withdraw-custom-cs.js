import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { TitleCard } from '../components/common.js';
import { WithdrawAuxiliaryPartsCheckbox } from '../components/forms/checkboxes.js';
import { BackButton } from '../components/buttons.js';
import { QueryLoader } from '../modules/data.js';
import { 
  getStateList, FakeCompleteSetIcon
} from '../components/completeset-form.js';
import { ObjectForm } from '../components/object-form.js';
import { useWithdrawCustomCompleteSet, useGetAllParts } from '../modules/inventory.js';


export default function WithdrawCustomSetPage() {
  const stateList = [
    {
      key: "quantity", label: "Amount of Sets",
      initialState: 1,
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
  ].concat(getStateList({temporary: true}))
  const useMakeSubmitFn = (options) => useWithdrawCustomCompleteSet(options);
  const allPartsQuery = useGetAllParts()
  const history = useHistory()
  const backToCompleteSet = useCallback(
    () => history.push('/completeset'),
    [history],
  )
  const FormChildren = ({formState}) => (
    <>
      <QueryLoader query={allPartsQuery} propName="parts">
        <FakeCompleteSetIcon {...{stateList, position: "top", formState}}/>
      </QueryLoader>
      <BackButton onClick={backToCompleteSet}/>
    </>
  )
  return (
    <div className="page">
      <TitleCard title="Withdraw Custom Complete Set">
        <WithdrawAuxiliaryPartsCheckbox/>
      </TitleCard>
      <ObjectForm {...{
        useMakeSubmitFn, stateList, buttonText: "Submit",
        forwardFormState: true, formStyle: {marginTop: 100}
      }}>
        <FormChildren/>
      </ObjectForm>
    </div>
  );
}
