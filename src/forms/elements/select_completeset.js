import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { server_url, api_path, DATA_TYPE } from '../../constants.js';
import { processDBData, getDBDataByName } from '../../modules/data.js';

/*
 * SelectCompletesetFormElement:
 *
 * pass in completesetIDRef which will always equal the current
 * selectedCompleteset, if any is selected
 */
export function SelectCompletesetFormElement({ completesetIDRef, label}){

  const [selectedCompletesetName, setSelectedCompletesetName] = useState("");
  const [selectedCompletesetID, setSelectedCompletesetID] = useState("");

  useEffect(
    () => {
      completesetIDRef.current = selectedCompletesetID
    }, [completesetIDRef, selectedCompletesetID]
  );

  let request_url = "completesets/fetch-all";
  console.log("QUERY", request_url);
  let completesets = useQuery(
    request_url,
    () => fetch(
      server_url + api_path + request_url,
      {method: 'GET'}
    ).then(res => res.json())
  );

  if(completesets.isError){
    console.log("ERROR Fetching Parts:", completesets.error);
  }
  let processed_completesets;
  if (!(completesets.isLoading || completesets.isError) && completesets.data){
    processed_completesets = processDBData(completesets.data, DATA_TYPE.COMPLETE_SET);
  }

  function onChange(e){
    if (!processed_completesets) {
      return
    }
    setSelectedCompletesetName(e.target.value);
    setSelectedCompletesetID(getDBDataByName(e.target.value, processed_completesets).id);
  }

  function getCompletesetOptions(){
    if(!processed_completesets){
      return <></>
    }
    let processed_completesets_array  = []
    Object.keys(processed_completesets).forEach(function(key) {
      processed_completesets_array.push(processed_completesets[key]);
    });
    return processed_completesets_array.map(
      (completeset) => <option value={completeset.name} key={completeset.name}>{completeset.name}</option>
    );
  }

  if(!label){
    label = "Select Complete Set:"
  }

  return (
    <label>
      { label }
      <select
        value={selectedCompletesetName}
        name="selectedPartName"
        onChange={onChange}
      >
        <option value="" selected hidden>Choose here</option>
        { getCompletesetOptions() }
      </select>
    </label>
  );

}
