import React from 'react';
import { useQuery } from 'react-query';

import { server_url, api_path, DATA_TYPE } from "../constants.js";
import { processDBData } from "../modules/data.js";
import jmklogo from '../jmklogo.png';


function CompletesetInventoryEntry({completeset_id, completeset}){
  let request_string = "completesets/actions/stock?id=" + String(completeset_id)
  let cs_stock = useQuery(
    request_string,
    () => fetch(
      server_url + api_path + request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  let max_amount=0
  let limiting_part_id=0
  if(cs_stock.data){
    max_amount = cs_stock.data[0]
    limiting_part_id = cs_stock.data[1]
  }
  let part_request_string = "parts/fetch-all"
  let limiting_part_response = useQuery(
    part_request_string,
    () => fetch(
      server_url + api_path + part_request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  let limiting_part;
  let processed_parts;
  if(limiting_part_response.data){
    processed_parts = processDBData(limiting_part_response.data, DATA_TYPE.PART)
    limiting_part = processed_parts[limiting_part_id]
  }
  let cs_request_string = "completesets/fetch?id=" + String(completeset_id)
  let cs_info = useQuery(
    cs_request_string,
    () => fetch(
      server_url + api_path + cs_request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  let cs_desc = "";
  if(cs_request_string.data){
    let completeset_obj = processDBData(cs_request_string.data, DATA_TYPE.COMPLETE_SET)[completeset_id];
    completeset_obj.all_parts.forEach((id) => cs_desc = cs_desc + processed_parts[id].name)
  }

  return (
    <div className="Form">
      <div className="FormBox">
        <p className="RowFormTitle">Complete Set: {completeset.name}</p>
        <div className="FormRow">
          <p className="CompletesetInfo"></p>
        </div>
        <div className="FormRow">
          {(limiting_part && max_amount) ?
            <p className="CompletesetInfo">You could build {max_amount} of these until you run out of {limiting_part.name}s.</p>
            :<></>
          }
        </div>
      </div>
    </div>
  );
}


export function CompletesetsInventoryPage() {
  let request_string = "completesets/fetch-all";
  let completesets = useQuery(
    request_string,
    () => fetch(
      server_url + api_path + request_string,
      {method: 'GET'},
    ).then(res=>res.json())
  )
  if(completesets.loading) {
    return <p>Loading Complete Sets...</p>
  }
  if(completesets.error) {
    return <p className="ResultErrorReport">Error Occurred: {completesets.error.message}</p>
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
      (id) => <CompletesetInventoryEntry completeset_id={id} completeset={all_completesets[id]} key={id}/>
    )
    }
    </div>
  );
}
