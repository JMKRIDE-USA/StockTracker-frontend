import React from 'react';

export function makeTypeSelector(value, name, onChange, allowNone){
  return (
    <select value={value} name="type" onChange={onChange}>
      { allowNone
        ?  <option value="" selected>None</option>
        :  <option value="" selected disabled hidden>Select Type</option>
      }
      <option value="wheel">Wheel</option>
      <option value="truck">Truck</option>
      <option value="plate">Plate</option>
      <option value="grip">Grip</option>
      <option value="apparel">Apparel</option>
      <option value="other">Other</option>
    </select>
  );
}
