import { configureStore } from '@reduxjs/toolkit';

import { PART_TYPE } from "../constants.js";
import inventoryReducer from './reducers/inventory.js';
import partsReducer from './reducers/parts.js';
//import completeSetReducer from './reducers/completeset.js';

const preloadedState = {
  // ID : Quantity
  inventory: {0: 0},
  // ID : { active: bool, name: string, type: PART_TYPE, created_at: timestamp }
  parts: {
    0: {
      active: true,
      name: "Initial Part",
      type: PART_TYPE.OTHER,
      created_at: 0,
    }
  }
}


export default configureStore({
  reducer: {
    inventory: inventoryReducer,
    parts: partsReducer,
//    completeset: completeSetReducer,
  },
  preloadedState,
});
