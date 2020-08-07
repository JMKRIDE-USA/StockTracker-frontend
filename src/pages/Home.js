import React from 'react';
import { useQuery } from 'react-query';

import jmklogo from '../jmklogo.png';
import { processParts } from '../modules/data.js';
import { server_url, api_path } from "../constants.js";

export function Home() {

  let inventory = useQuery(
    "inventory/all",
    () => fetch(
      server_url + api_path + "inventory/fetch-all",
      {method: 'GET'}
    ).then(res => res.json())
  );
  let parts = useQuery(
    "parts/all",
    () => fetch(
      server_url + api_path + "parts/fetch-all",
      {method: 'GET'}
    ).then(res => res.json())
  );
  let completesets = useQuery(
    "completesets/all",
    () => fetch(
      server_url + api_path + "completesets/fetch-all",
      {method: 'GET'}
    ).then(res => res.json())
  );
  console.log("PARTS_DATA", parts.data)
  console.log("COMPLETESETS_DATA", completesets.data)
  console.log("INV_DATA", inventory.data);

  let isLoading = [parts.loading, inventory.loading, completesets.loading].some(Boolean)
  let errorOccurred = [parts.isError, inventory.isError, completesets.isError].some(Boolean)
  let hasData = [parts.data, inventory.data].every(Boolean)

  let processed_parts;
  if (!isLoading && !errorOccurred && hasData) {
    processed_parts = processParts(parts.data);
  }
  console.log("Processed Parts:", processed_parts);

  return (
    <div className="MainPage">
      <img src={jmklogo} className="JMKRIDE-logo" alt="JMKRIDE-logo" />
      <p>
        JMKRIDE Stock Tracking System
      </p>
      { isLoading &&
        <p> Loading Inventory...</p>
      }

      { errorOccurred &&
        <div className="ErrorMessage">
          <p>ERROR Occured!</p>
          <p>{parts.error ? parts.error.message : "Parts OK"}</p>
          <p>{inventory.error ? inventory.error.message : "Inventory OK"}</p>
          <p>{completesets.error ? completesets.error.message : "Complete Sets OK"}</p>
        </div>
      }

      { ((!isLoading) && (!errorOccurred) && hasData)
          ? <p>Success</p>
          : <p> Loading... </p>
      }
    </div>
  );
}
