import React, { useState, useCallback } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import styled from 'styled-components';

import { CreateButton } from '../components/buttons.js';
import { PageCard, TitleCard } from '../components/common.js';
import { ISOToReadableString } from '../modules/date.js';
import { InfoListFromObject } from '../components/lists.js';
import { PartTable } from '../components/tables/parts.js';
import { QueryLoader } from '../modules/data.js';
import { PartsDisplay } from '../components/inventory-display.js';
import { PartHistoryDisplayChart } from '../components/quantity-history-display.js';
import { PageableLogTable } from '../components/tables/logs.js';
import {
  useGetPart,
  useGetAllParts,
  useSearchAllParts,
} from '../modules/inventory.js';


function PartChartCard({part}) {
  return (
    <PageCard style={{minWidth: "1000px"}}>
      <PartsDisplay
        parts={[part]}
        name={part.name}
        height={80}
        initialSelectedPart={part}
        partInfoAndControlsOptions={{
          partViewButton: false,
          depositEnabled: true,
        }}
      />
    </PageCard>
  );
}

function PartInfoCard({part}) {
  const history = useHistory()
  const editPart  = useCallback(
    () => history.push('/edit-part/' + part._id),
    [history, part._id],
  )
  return (
    <TitleCard title={"Part: " + part.name}>
      <InfoListFromObject data={{
        "Created At": ISOToReadableString(part.createdAt),
        "Created By": part.creator.firstName + " " + part.creator.lastName,
        "Last Update": ISOToReadableString(part.updatedAt),
      }}/>
      <button style={{marginLeft: 20}} className="btn btn-secondary" onClick={editPart}>Edit Part</button>
    </TitleCard>
  );
}

function SinglePartPage({ id }){
  const partQuery = useGetPart(id);
  return (
    <>
      <QueryLoader query={partQuery} propName={"part"} pageCard>
        <PartInfoCard/>
        <PartChartCard/>
      </QueryLoader>
      <PageableLogTable
        endpoint={"logs/part/id/" + id} title={"Update History:"}
        subjectName="Part" raw
      />
      <PartHistoryDisplayChart partId={id}/>
    </>
  );
}

const SearchForm = styled.div`
  width: 98%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  form {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    & > input {
      max-width: 150px;
      margin-left: 10px;
      border: 1px solid black;
    }
  }
`

function AllPartsPage({parts}) {
  const history = useHistory()
  const createPart = useCallback(
    () => history.push('/create-part'),
    [history],
  )
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const searchParts = useSearchAllParts()
  const onChange = async e => {
    setSearchString(e.target.value)
    if(searchString) {
      let a = await searchParts(
        {query: e.target.value}
      ).then(res => res.result.json())
      setSearchResult(a.result) 
    }
  }
  const onSubmit = e => {
    e.preventDefault();
  }
  return (
    <>
      <TitleCard title="All Parts"/>
      <PageCard>
        <SearchForm>
          <CreateButton onClick={createPart}/>
          <form className="form-group" onSubmit={onSubmit}>
            <label htmlFor="search">
              <HiSearch size={20}/>
            </label>
            <input
              className="form-control"
              type="search" name="search" id="search"
              onChange={onChange}
              value={searchString}
              placeholder="Search"
            />
          </form>
        </SearchForm>
        <PartTable parts={searchString ? searchResult : parts}/>
      </PageCard>
    </>
  );
}

export default function PartPage() {
  const { id } = useParams();
  const allPartsQuery = useGetAllParts()
  return (
    <div className="page">
      { id 
        ? <SinglePartPage id={id}/> 
        : <QueryLoader query={allPartsQuery} propName="parts" pageCard>
          <AllPartsPage/> 
        </QueryLoader>
      }
    </div>
  );
}

