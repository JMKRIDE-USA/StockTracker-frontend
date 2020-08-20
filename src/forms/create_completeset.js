import React, { useState, useRef } from 'react';
import { useMutation, queryCache } from 'react-query';

import { server_url, api_path, PART_TYPE } from "../constants.js";
import { SelectPartFormElement } from "./elements/select_part.js";


export function CreateCompleteSetForm(){

  const [name, setName] = useState("");
  const [active, setActive] = useState("");
  const [image, setImage] = useState("");

  const awheel1 = useRef(null);
  const awheel2 = useRef(null);
  const atruck = useRef(null);
  const adeck = useRef(null);
  const agrip = useRef(null);

  const bwheel1 = useRef(null);
  const bwheel2 = useRef(null);
  const btruck = useRef(null);
  const bdeck = useRef(null);
  const bgrip = useRef(null);

  const [result, setResult] = useState("");
  const [resultWasError, setResultWasError] = useState(false);

  const [mutate, { error }] = useMutation(({to_submit}) => fetch(
    server_url + api_path + "completesets/actions/create",
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

  async function handleSubmit(event){
    event.preventDefault();
    let to_submit = {
      name: name,
      image_data: image,
      image_name: image.name,
      active: active === "yes",

      awheel1: awheel1.current,
      awheel2: awheel2.current,
      atruck: atruck.current,
      adeck: adeck.current,
      agrip: agrip.current,
      bwheel1: bwheel1.current,
      bwheel2: bwheel2.current,
      btruck: btruck.current,
      bdeck: bdeck.current,
      bgrip: bgrip.current,

      created_at: Date.now(),
    }
    let formComplete = true;
    Object.keys(to_submit).forEach(function(key) {
      if(to_submit[key] === null || to_submit[key] === ""){
        formComplete = false;
      }
    });

    if(!formComplete) {
      setResult("Form incomplete.");
      setResultWasError(true);
      return;
    }
    console.log("Submitting:", to_submit);

    try {
      await mutate({to_submit})
    } catch (error) {
      console.log("ERROR SUBMITTING", error)
    }

    if (error) {
      setResult("Failed! Request error:", error.message);
      setResultWasError(true);
    } else {
      setResult("Successfully created complete set!")
      setResultWasError(false);

      setName("")
      setImage("");
      setActive("")
      document.getElementById("create_completeset").reset();
    }
  }
  return (
    <div className="Form">
      <div className="FormBox">
        <div className="FormRow">
          <p className="RowFormTitle"> Create Complete Set: </p>
          <div className="ResultReport">
            { result
              ? resultWasError
                ? <p className="ResultErrorReport">{ result }</p>
                : <p className="ResultSuccessReport">{ result }</p>
              : <></>
            }
          </div>
        </div>
        <form id="create_completeset" className="RowFormContent" onSubmit={handleSubmit}>
          <div className="FormRow">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label>
              Active:
              <select value={active} name="active" onChange={e => setActive(e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              Image:
              <input type="file" onChange={e => setImage(e.target.files[0])}/>
            </label>
          </div>
          <div className="FormRow">
            <p className="FormTitle">First Skate:</p>
            <SelectPartFormElement partIDRef={awheel1} partType={PART_TYPE.WHEEL} label={"Wheel1"}/>
            <SelectPartFormElement partIDRef={awheel2} partType={PART_TYPE.WHEEL} label={"Wheel2"}/>
            <SelectPartFormElement partIDRef={atruck} partType={PART_TYPE.TRUCK} label={"Truck"}/>
            <SelectPartFormElement partIDRef={adeck} partType={PART_TYPE.DECK} label={"Deck"}/>
            <SelectPartFormElement partIDRef={agrip} partType={PART_TYPE.GRIP} label={"Grip"}/>
          </div>
          <div className="FormRow">
            <p className="FormTitle">Second Skate:</p>
            <SelectPartFormElement partIDRef={bwheel1} partType={PART_TYPE.WHEEL} label={"Wheel1"}/>
            <SelectPartFormElement partIDRef={bwheel2} partType={PART_TYPE.WHEEL} label={"Wheel2"}/>
            <SelectPartFormElement partIDRef={btruck} partType={PART_TYPE.TRUCK} label={"Truck"}/>
            <SelectPartFormElement partIDRef={bdeck} partType={PART_TYPE.DECK} label={"Deck"}/>
            <SelectPartFormElement partIDRef={bgrip} partType={PART_TYPE.GRIP} label={"Grip"}/>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}
