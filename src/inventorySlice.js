import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventoryId: undefined,
    categorySetId: undefined,
    CSSetId: undefined,
    partTypeCategories: undefined,
    auxiliaryParts: undefined,
    withdrawAuxiliaryParts: undefined,
  },
  reducers: {
    setInventoryId: (state, action) => {
      state.inventoryId = action.payload;
    },
    setCategorySetId: (state, action) => {
      state.categorySetId = action.payload;
    },
    setCSSetId: (state, action) => {
      state.CSSetId = action.payload;
    },
    setPartTypeCategories: (state, action) => {
      state.partTypeCategories = action.payload
    },
    setAuxiliaryParts: (state, action) => {
      state.auxiliaryParts = action.payload
    },
    setWithdrawAuxiliaryParts: (state, action) => {
      state.withdrawAuxiliaryParts = action.payload
    },
    wipeDefaults: (state, _) => {
      state.inventoryId = undefined;
      state.categorySetId = undefined;
      state.CSSetId = undefined;
    },
  },
});

export const {
  setInventoryId,
  setCategorySetId,
  setCSSetId,
  setPartTypeCategories,
  setPartTypeCategory,
  setAuxiliaryParts,
  setWithdrawAuxiliaryParts,
  wipeDefaults,
} = inventorySlice.actions;

export const selectInventoryId = state => state.inventory.inventoryId;
export const selectCategorySetId = state => state.inventory.categorySetId;
export const selectCSSetId = state => state.inventory.CSSetId;
export const selectPartTypeCategories = state => state.inventory.partTypeCategories;
export const selectAuxiliaryParts = state => state.inventory.auxiliaryParts;
export const selectWithdrawAuxiliaryParts = state => state.inventory.withdrawAuxiliaryParts;

export default inventorySlice.reducer;
