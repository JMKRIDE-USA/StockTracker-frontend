import React from 'react';

import { CSPartPropertyList, PartTypes } from '../constants.js';
import {
  ColorSelector, SinglePartSelector, MultiCSSetSelector,
} from '../components/selectors.js';
import { CompleteSetIcon } from '../components/completeset-icons.js';

export const getStateList = ({completeSet, temporary = false} = {}) => {
  const getState = (label, key, type) => ({
    key, label, initialState: (completeSet 
        ? ({value: completeSet[key]._id, label: completeSet[key].name}) 
        : "" 
    ), component: (props) => <SinglePartSelector partType={type} {...props}/>,
    formatFn: c => c?.value,
  })

  const allParts = [
    ["Left Wheel #1", "lwheel1", PartTypes.WHEEL],
    ["Left Wheel #2",  "lwheel2", PartTypes.WHEEL],
    ["Left Truck",  "ltruck", PartTypes.TRUCK],
    ["Left Deck",  "ldeck", PartTypes.DECK],
    ["Left Grip",  "lgrip", PartTypes.GRIP],
    ["Right Wheel #1",  "rwheel1", PartTypes.WHEEL],
    ["Right Wheel #2",  "rwheel2", PartTypes.WHEEL],
    ["Right Truck",  "rtruck", PartTypes.TRUCK],
    ["Right Deck",  "rdeck", PartTypes.DECK],
    ["Right Grip",  "rgrip", PartTypes.GRIP],
  ];
  const allPartsState = allParts.map(part => getState(...part));
  const allState = [
    {
      key: "name", label: "Name",
      initialState: completeSet ? completeSet.name : "",
      component: (props) => (
        <input
          type="text" name="name"
          className="form-control" placeholder="New Complete Set" 
          {...props}
        />
      ),
      formatFn: _=>_,
    },
    {
      key: "color", label: "Color",
      initialState: completeSet ? {value: completeSet.color, label: completeSet.color} : "",
      component: ColorSelector, formatFn: c => c?.value,
    },
    {
      key: "CSSetIds", label: "CS Sets",
      initialState: completeSet
        ? completeSet.CSSets.map(
          CSSet => ({value: CSSet.CSSet.id, label: CSSet.CSSet.name})
        ) : [],
      component: MultiCSSetSelector,
      formatFn: cssets => cssets.map(csset => csset?.value),
    },
    ...allPartsState
  ];
  if(temporary) {
    return allPartsState;
  }
  return allState;
}

export function FakeCompleteSetIcon({formState, parts}) {
  let fakeCS = {
    _id: "fake-cs",
  }
  const getPartColor = (id) => {
    const found = parts.filter(p => p._id === id)
    if(found.length) {
      return found[0].color
    }
    return "White"
  }
  Object.entries(formState).forEach(([key, value]) => {
    if(CSPartPropertyList.includes(key)) {
      fakeCS[key] = {color: getPartColor(value?.value)}
    }
  })
  return <CompleteSetIcon completeSet={fakeCS} position="top"/>
}
