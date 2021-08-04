import React, { useState } from 'react';

import { PartTypes } from '../constants.js';
import {
  ColorSelector, SinglePartSelector, MultiCSSetSelector,
} from '../components/selectors.js';
import { CompleteSetIcon } from '../components/completeset-icons.js';

export const useGetStateList = ({completeSet, temporary = false} = {}) => {
  const useGetState = (label, key, type) => ({
    key, label, state: useState(
      completeSet 
        ? ({value: completeSet[key]._id, label: completeSet[key].name}) 
        : undefined
    ), component: (props) => <SinglePartSelector partType={type} {...props}/>,
    formatFn: c => c?.value,
  })

  const allPartsState = [
    useGetState("Left Wheel #1", "lwheel1", PartTypes.WHEEL),
    useGetState("Left Wheel #2",  "lwheel2", PartTypes.WHEEL),
    useGetState("Left Truck",  "ltruck", PartTypes.TRUCK),
    useGetState("Left Deck",  "ldeck", PartTypes.DECK),
    useGetState("Left Grip",  "lgrip", PartTypes.GRIP),
    useGetState("Right Wheel #1",  "rwheel1", PartTypes.WHEEL),
    useGetState("Right Wheel #2",  "rwheel2", PartTypes.WHEEL),
    useGetState("Right Truck",  "rtruck", PartTypes.TRUCK),
    useGetState("Right Deck",  "rdeck", PartTypes.DECK),
    useGetState("Right Grip",  "rgrip", PartTypes.GRIP),
  ];
  const allState = [
    {
      key: "name", label: "Name",
      state: useState(completeSet ? completeSet.name : ""),
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
      state: useState(completeSet ? {value: completeSet.color, label: completeSet.color} : ""),
      component: ColorSelector, formatFn: c => c?.value,
    },
    {
      key: "CSSetIds", label: "CS Sets",
      state: useState(completeSet
        ? completeSet.CSSets.map(
          CSSet => ({value: CSSet.CSSet.id, label: CSSet.CSSet.name})
        ) : []),
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

export function FakeCompleteSetIcon({stateList, parts}) {
  const stateListToFakeCS = (stateList) => {
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
    stateList.forEach(item => 
      fakeCS[item.key] = {color: getPartColor(item.formatFn(item.state[0]))}
    )
    return fakeCS;
  };
  return <CompleteSetIcon completeSet={stateListToFakeCS(stateList)} position="top"/>
}
