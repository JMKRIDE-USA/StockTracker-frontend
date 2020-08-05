import { createReducer } from '@reduxjs/toolkit';

import {
  depositPart,
  withdrawPart,
  initPart,
} from "../actions.js";


function reduceInitPart(state, { payload }){
  return {
    ...state,
    [payload.id]: payload.quantity,
  }
}

function reduceDepositPart(state, { payload }){
  if(! (payload.id in state)){
    // part does not exist
    console.log("[ERROR] Part ID", payload.id, "has not been initialized.");
    return state;
  }
  return {
    ...state,
    [payload.id]: state[payload.id] + payload.quantity,
  }
}

function reduceWithdrawPart(state, { payload }){
  if(! (payload.id in state)){
    // part does not exist
    console.log("[ERROR] Part ID", payload.id, "has not been initialized.");
    return state;
  }
  return {
    ...state,
    [payload.id]: state[payload.id] - payload.quantity,
  }
}

export default createReducer(
  null,
  {
    [ depositPart ]: reduceDepositPart,
    [ withdrawPart ]: reduceWithdrawPart,
    [ initPart ]: reduceInitPart
  },
);
