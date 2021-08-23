import React, { useCallback } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { MdAdd } from 'react-icons/md';
import { useSelector } from 'react-redux';

import { QueryLoader } from '../modules/data.js';
import { WithdrawAuxiliaryPartsCheckbox } from '../components/forms/checkboxes.js';
import { selectCSSetId } from '../redux/inventorySlice.js';
import { useGetAllCS, useGetCSById } from '../modules/inventory.js';
import { CSSetSelector } from '../components/selectors.js';
import { PageCard, TitleCard } from '../components/common.js';
import { 
  ReorderButton, EditButton, CreateButton, BackButton 
} from '../components/buttons.js';
import { PartsDisplay } from '../components/inventory-display.js';
import { CompleteSetIcon } from '../components/completeset-icons.js';
import {
  CompleteSetWithdrawalForm, CompleteSetDepositForm,
} from '../components/parts.js';


const getDescription = (completeSet) => {
  let desc = "";
  completeSet.allParts.forEach((part, index) => {
    let occurances = completeSet.idOccurances[part._id];
    desc += (
      (index > 0 ? ", " : "") + occurances + " "
      + part.name + (occurances > 1 ? "s" : "")
    )
  })
  return desc;
}

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  position: relative;
  & > * {
    margin-left: 20px;
  }
`
const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  & > * {
    padding-right: 10px;
    padding-left: 10px;
  }
`

function CompleteSetInfo({completeSet, index=0, fullpage=false}) {
  const history = useHistory()
  const editCompleteSet = useCallback(
    () => history.push('/edit-completeset/' + completeSet._id),
    [history, completeSet._id],
  )
  const viewCompleteSet = useCallback(
    () => history.push('/completeset/' + completeSet._id),
    [history, completeSet._id],
  )
  const backToCompleteSets = useCallback(
    () => history.push('/completeset'),
    [history],
  )
  return (
    <PageCard key={index} style={{position: "relative", maxWidth: "95vw"}}>
      <TitleRow>
        <CompleteSetIcon completeSet={completeSet}/>
        <h3>Complete Set: "{completeSet.name}" </h3>
        {fullpage
          ?  <EditButton
            onClick={editCompleteSet}
            style={{position: "absolute", right: 0, marginRight: 50}}
          /> : <button
            onClick={viewCompleteSet}
            className="btn btn-secondary"
          >View</button>
        }
      </TitleRow>
      { getDescription(completeSet) }
      <FormRow>
        <CompleteSetWithdrawalForm completeSet={completeSet}/>
        { fullpage && <CompleteSetDepositForm completeSet={completeSet}/> }
      </FormRow>
      {fullpage &&
        <>
          <PartsDisplay
            parts={completeSet.allParts}
            name={completeSet.name}
            height={50}
            partOccurance={completeSet.idOccurances}
            title={false}
          />
          <BackButton onClick={backToCompleteSets}/>
        </>
      }
    </PageCard>
  );
}

function CompleteSetList({completeSets}) {
  return (
    <>
      { completeSets.length 
        ? completeSets.map((completeSet, index) => (
          <CompleteSetInfo completeSet={completeSet} key={index} index={index}/>
        ))
        : <PageCard>No Complete Sets Found.</PageCard>
      }
    </>
  );
}

export default function CompleteSetPage() {
  const { id } = useParams();
  const idCSQuery = useGetCSById(id);
  const allCSQuery = useGetAllCS();
  const history = useHistory()
  const createCompleteSet = useCallback(
    () => history.push('/create-completeset'),
    [history],
  );
  const currentCSSet = useSelector(selectCSSetId);
  const reorderCSSet = useCallback(
    () => history.push('/reorder-csset/' + currentCSSet),
    [history, currentCSSet],
  )
  const editCSSet = useCallback(
    () => history.push('/edit-csset/' + currentCSSet),
    [history, currentCSSet],
  )
  const createCSSet = useCallback(
    () => history.push('/create-csset'),
    [history],
  )
  const withdrawCustomSet = useCallback(
    () => history.push('/withdraw-custom-completeset'),
    [history],
  )
  return (
    <div className="page">
    { id 
      ? <QueryLoader query={idCSQuery} propName="completeSet" pageCard>
          <CompleteSetInfo fullpage/> 
        </QueryLoader>
      : <>
        <TitleCard title={"Complete Sets"}>
          <div className="flex-row flex-centered">
            <div className="text-bold"> Current CS Set:</div>
            <CSSetSelector/>
            <ReorderButton onClick={reorderCSSet} style={{marginRight: 5}}/>
            <EditButton onClick={editCSSet} style={{marginRight: 5}}/>
            <CreateButton onClick={createCSSet}/>
          </div>
          <div className="flex-row flex-centered">
            <div className="text-bold" style={{marginRight: 20}}>
              Create Complete Set:
            </div>
            <button className="btn btn-primary" onClick={createCompleteSet}>
              <MdAdd size={30} color="white"/>
            </button>
          </div>
          <div className="flex-row flex-centered">
            <button className="btn btn-secondary" onClick={withdrawCustomSet}>
              Withdraw Custom Set
            </button>
          </div>
          <WithdrawAuxiliaryPartsCheckbox/>
        </TitleCard>
        <QueryLoader query={allCSQuery} propName="completeSets" pageCard>
          <CompleteSetList/>
        </QueryLoader>
      </>
    }
    </div>
  );
}
