import React, { useState } from 'react';
import { useMutation, queryCache } from 'react-query';

import { server_url, api_path, COLOR, ALL_COLORS } from "../constants.js";
import { makeTypeSelector } from "./elements/type_helpers.js";


export function CreatePartForm(){

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [active, setActive] = useState("");
  const [result, setResult] = useState("");
  const [color, setColor] = useState("");
  const [resultWasError, setResultWasError] = useState(false);

  const [mutate, { error }] = useMutation(({to_submit}) => fetch(
    server_url + api_path + "parts/actions/create",
    {
      method: "PUT",
      headers: {"content_type": "application/json"},
      body: JSON.stringify(to_submit)
    }).then(res => res.json),
    {
      onSuccess: async () => {
        queryCache.invalidateQueries("inventory/all")
        queryCache.invalidateQueries("parts/all")
      }
    },
  );

  async function handleSubmit(event){
    event.preventDefault();
    let to_submit = {
      name: name,
      quantity: quantity,
      type: type,
      color: COLOR[color],
      created_at: Date.now(),
      active: active === "yes",
    }
    if (!(name && quantity && type && color)){
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
      setResult("Successfully created part!")
      setResultWasError(false);
      setName("")
      setType("")
      setQuantity("")
      setColor("")
      setActive("")
      document.getElementById("create_part").reset();
    }
  }
  return (
    <div className="Form">
      <div className="FormBox">
        <div className="FormRow">
          <p className="RowFormTitle"> Create Part: </p>
          <div className="ResultReport">
            { result
              ? resultWasError
                ? <p className="ResultErrorReport">{ result }</p>
                : <p className="ResultSuccessReport">{ result }</p>
              : <></>
            }
          </div>
        </div>
        <form id="create_part" className="RowFormContent" onSubmit={handleSubmit}>
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
              Quantity:
              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </label>
          </div>
          <div className="FormRow">
            <label>
              Type:
              { makeTypeSelector(type, "type", e => setType(e.target.value)) }
            </label>
            <label>
              Color:
              <select value={color} name="color" onChange={e => setColor(e.target.value)}>
                <option value="" selected disabled hidden>Select Color</option>
                { ALL_COLORS.map((color) => <option value={color} key={color}>{color}</option>) }
              </select>
            </label>
            <label>
              Active:
              <select value={active} name="active" onChange={e => setActive(e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}
