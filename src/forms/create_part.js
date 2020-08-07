import React, { useState } from 'react';
import { useMutation, queryCache } from 'react-query';

import { processParts } from "../modules/data.js";
import { server_url, api_path } from "../constants.js";


export function CreatePartForm(){

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [active, setActive] = useState("")

  const [mutate, { status, data, error }] = useMutation(({to_submit}) => fetch(
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
      created_at: Date.now(),
      active: active === "yes",
    }
    console.log("Submitting:", to_submit);
    try {
      await mutate({to_submit})
    } catch (error) {
      console.log("ERROR SUBMITTING", error)
    }
    console.log("Request status:", status);
    if (!error && data) {
      let processed_parts = processParts(data)
      console.log("Successfully created parts:", processed_parts);
    }
  }
  return (
    <div className="FormBox">
      <p className="RowFormTitle"> Create Part: </p>
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
            <select value={type} name="type" onChange={e => setType(e.target.value)}>
              <option value="" selected disabled hidden>Choose here</option>
              <option value="wheel">Wheel</option>
              <option value="truck">Truck</option>
              <option value="plate">Plate</option>
              <option value="grip">Grip</option>
              <option value="apparel">Apparel</option>
              <option value="other">Other</option>
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
  );
}
