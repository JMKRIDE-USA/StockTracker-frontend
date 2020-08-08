import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { server_url, api_path } from '../../constants.js';
import { processParts, getPartByName } from '../../modules/data.js';

/*
 * SelectPartFormElement:
 *
 * pass in partIDRef which will always equal the current selectedPart,
 * if any is selected
 *
 * pass partType to filter parts by that type
 */
export function SelectPartFormElement({ partIDRef, partType}){
  const [selectedPartName, setSelectedPartName] = useState("");
  const [selectedPartID, setSelectedPartID] = useState("");

  useEffect(
    () => {
      partIDRef.current = selectedPartID
    }, [partIDRef, selectedPartID]
  );

  let request_url = "parts/fetch-all";
  if (partType) {
    request_url = "parts/fetch?type=" + partType;
  }
  console.log("QUERY", request_url);
  let parts = useQuery(
    request_url,
    () => fetch(
      server_url + api_path + request_url,
      {method: 'GET'}
    ).then(res => res.json())
  );

  if(parts.isError){
    console.log("ERROR Fetching Parts:", parts.error);
  }
  let processed_parts;
  if (!(parts.isLoading || parts.isError) && parts.data){
    processed_parts = processParts(parts.data);
  }

  function onChange(e){
    if (!processed_parts) {
      return
    }
    setSelectedPartName(e.target.value);
    setSelectedPartID(getPartByName(e.target.value, processed_parts).id);
  }

  function getPartOptions(){
    if(!processed_parts){
      return <></>
    }
    let processed_parts_array  = []
    Object.keys(processed_parts).forEach(function(key) {
      processed_parts_array.push({id: key, ...processed_parts[key]});
    });
    return processed_parts_array.map(
      (part) => <option value={part.name} key={part.name}>{part.name}</option>
    );
  }

  return (
    <label>
      Select Part:
      <select
        value={selectedPartName}
        name="selectedPartName"
        onChange={onChange}
      >
        <option value="" selected disabled hidden>Choose here</option>
        { getPartOptions() }
      </select>
    </label>
  );

}
