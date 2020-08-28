import React from 'react';
import { useQuery } from 'react-query';

import { server_url, api_path, DATA_TYPE } from "../constants.js";
import { processDBData } from "../modules/data.js";
import jmklogo from '../jmklogo.png';


function CompletesetInventoryEntry({completeset_id, completeset, processed_parts}){
  let request_string = "completesets/actions/stock?id=" + String(completeset_id)
  let cs_stock_response = useQuery(
    request_string,
    () => fetch(
      server_url + api_path + request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  let max_amount=0
  let limiting_part_id=0
  if(cs_stock_response.data){
    max_amount = cs_stock_response.data[0]
    limiting_part_id = cs_stock_response.data[1]
  }
  let limiting_part;
  if(processed_parts){
    limiting_part = processed_parts[limiting_part_id]
  }
  let id_quantities = {} /* id: quantity */
  completeset.all_parts.forEach(
    function(id) {
      if(id in id_quantities){
        id_quantities[id] += 1;
      } else {
        id_quantities[id] = 1;
      }
    }
  );
  let cs_desc = "";
  if(processed_parts){
    Object.keys(id_quantities).forEach(
      function(id) {
        cs_desc = cs_desc.concat(String(id_quantities[id]), " ", processed_parts[id].name, "s, ");
      }
    );
    if(cs_desc !== ""){
      cs_desc = cs_desc.substring(0, cs_desc.length - 2)
    }
  }

  return (
    <div className="Form">
      <div className="FormBox">
        <div className="FormRow">
          <p className="RowFormTitle">Complete Set: {completeset.name}</p>
        </div>
        <div className="FormRow">
          {(cs_desc !== "") ?
            <p className="CompletesetInfo">Description: {cs_desc}.</p>
            :<></>
          }
        </div>
        <div className="FormRow">
          {(limiting_part && max_amount) ?
            <p className="CompletesetInfo">You could build {max_amount} of these until you run out of {limiting_part.name}s.</p>
            :<p className="CompletesetInfo ResultErrorReport">Build information unavailable.</p>
          }
        </div>
      </div>
    </div>
  );
}


export function CompletesetsInventoryPage() {

  let part_request_string = "parts/fetch-all"
  let all_parts = useQuery(
    part_request_string,
    () => fetch(
      server_url + api_path + part_request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  let processed_parts;
  if(all_parts.data){
    processed_parts = processDBData(all_parts.data, DATA_TYPE.PART)
  }

  let request_string = "completesets/fetch-all";
  let completesets = useQuery(
    request_string,
    () => fetch(
      server_url + api_path + request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  if(completesets.loading || all_parts.loading) {
    return <p>Loading Complete Sets and Parts...</p>
  }
  if(completesets.error) {
    return <p className="ResultErrorReport">Error Occurred: {completesets.error.message}</p>
  }
  if(all_parts.error) {
    return <p className="ResultErrorReport">Error Occurred: {all_parts.error.message}</p>
  }
  let all_completesets = {}
  if(completesets.data){
    all_completesets = processDBData(completesets.data, DATA_TYPE.COMPLETE_SET);
  }
  return (
    <div className="MainPage">
      <img src={jmklogo} className="JMKRIDE-logo" alt="JMKRIDE-logo" />
      <p>
        JMKRIDE Complete Sets Inventory
      </p>
    { Object.keys(all_completesets).map(
      (id) => <CompletesetInventoryEntry
               completeset_id={all_completesets[id].id}
               completeset={all_completesets[id]}
               processed_parts={processed_parts}
               key={id}
              />
    )
    }
    </div>
  );
}
