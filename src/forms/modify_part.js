import React, { useState, useRef } from 'react';
import { useMutation, queryCache } from 'react-query';

import { server_url, api_path } from "../constants.js";
import { SelectPartFormElement } from './elements/select_part.js';
import { makeTypeSelector } from './elements/type_helpers.js';

export function ModifyPartForm(){

  const [typeFilter, setTypeFilter] = useState("");
  const [action, setAction] = useState("");

  const [result, setResult] = useState("");
  const [resultWasError, setResultWasError] = useState("");

  const partIDRef = useRef(null);

  const [mutate, { error }] = useMutation(({to_submit}) => fetch(
    server_url + api_path + "parts/actions/modify",
    {
      method: "PUT",
      headers: {"content_type": "application/json"},
      body: JSON.stringify(to_submit)
    }).then(res => res.json),
    {
      onSuccess: async () => {
        queryCache.invalidateQueries("inventory/fetch")
        queryCache.invalidateQueries("parts/fetch")
      }
    },
  );

  async function handleSubmit(e){
    e.preventDefault();
    let to_submit = {
      id: partIDRef.current,
      action: action,
    }

    if (!(partIDRef.current && action)){
      setResult("Form incomplete.");
      setResultWasError(true);
      return;
    }

    try{
      await mutate({to_submit});
    } catch (error) {
      console.log("ERROR SUBMITTING", error)
    }
    if (error) {
      console.log("ERROR:", error);
      setResult("Failed! Request error:", error.message);
      setResultWasError(true);
    } else {
      setResult("Success!")
      setResultWasError(false);
      setTypeFilter("")
      setAction("")
      document.getElementById("modify_part").reset();
    }
  }

  return (
    <div className="Form">
      <div className="FormBox">
        <div className="FormRow">
          <p className="RowFormTitle">Modify Part: </p>
          <div className="ResultReport">
            { result
              ? resultWasError
                ? <p className="ResultErrorReport">{ result }</p>
                : <p className="ResultSuccessReport">{ result }</p>
              : <></>
            }
          </div>
        </div>
        <form id="modify_part" className="RowFormContent" onSubmit={handleSubmit}>
          <div className="FormRow">
            <label>
              Filter Parts:
              { makeTypeSelector(
                  typeFilter, "typeFilter",
                  e => setTypeFilter(e.target.value),
                  true
                )
              }
            </label>
            <SelectPartFormElement partIDRef={partIDRef} partType={typeFilter}/>
            <label>
              Action:
              <select value={action} name="action" onChange={e => setAction(e.target.value)}>
                <option value="" selected disabled hidden>Choose here</option>
                <option value="toggle_active">Toggle Active</option>
                <option value="delete">Delete</option>
              </select>
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}
