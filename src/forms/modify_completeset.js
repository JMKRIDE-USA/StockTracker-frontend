import React, { Fragment, useState, useRef } from 'react';
import { useMutation, queryCache } from 'react-query';

import { server_url, api_path } from "../constants.js";
import { SelectCompletesetFormElement } from './elements/select_completeset.js';

export function ModifyCompletesetForm(){

  const [action, setAction] = useState("");

  const [result, setResult] = useState("");
  const [resultWasError, setResultWasError] = useState("");

  const completesetIDRef = useRef(null);

  const [mutate, { error }] = useMutation(({to_submit}) => fetch(
    server_url + api_path + "completesets/actions/modify",
    {
      method: "PUT",
      headers: {"content_type": "application/json"},
      body: JSON.stringify(to_submit)
    }).then(res => res.json),
    {
      onSuccess: async () => {
        queryCache.invalidateQueries("completesets/fetch")
      }
    },
  );

  async function handleSubmit(e){
    e.preventDefault();
    let to_submit = {
      id: completesetIDRef.current,
      action: action,
    }

    if (!action || completesetIDRef.current === ""){
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
      setAction("")
      document.getElementById("modify_completeset").reset();
    }
  }

  return (
    <div className="Form">
      <div className="FormBox">
        <div className="FormRow">
          <p className="RowFormTitle">Modify Complete Set: </p>
          <div className="ResultReport">
            { result
              ? resultWasError
                ? <p className="ResultErrorReport">{ result }</p>
                : <p className="ResultSuccessReport">{ result }</p>
              : <Fragment></Fragment>
            }
          </div>
        </div>
        <form id="modify_completeset" className="RowFormContent" onSubmit={handleSubmit}>
          <div className="FormRow">
            <SelectCompletesetFormElement completesetIDRef={completesetIDRef}/>
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
