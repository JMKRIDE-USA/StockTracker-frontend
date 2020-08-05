import { createReducer } from '@reduxjs/toolkit';

import {
  createPart,
  toggleActivePart,
  deletePart,
} from "../actions.js";

function getUID(state) {
  let allIDs = Object.keys(state);
  let candidate = Math.max(...allIDs);
  while(candidate in allIDs){
    candidate = candidate + 1;
  }
  return candidate;
}

function reduceCreatePart(state, { payload }){
  return {
    ...state,
    [ getUID(state) ]: {
      name: payload.name,
      type: payload.type,
      active: true,
      created_at: Date.now(),
    },
  };
}

function reduceToggleActivePart(state, { payload }){
  return {
    ...state,
    [payload.id]: {
      ...state[payload.id],
      active: !state[payload.id].active,
    }
  };
}

export default createReducer(
  null,
  {
    [ createPart ]: reduceCreatePart,
    [ toggleActivePart ]: reduceToggleActivePart,
    [ deletePart ]: (state, { payload }) => {
      delete state[payload.id]
    },
  },
);
