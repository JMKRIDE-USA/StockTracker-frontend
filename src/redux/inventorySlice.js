import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventoryId: undefined,
    categorySetId: undefined,
  },
  reducers: {
    setInventoryId: (state, action) => {
      state.inventoryId = action.payload;
    },
    setCategorySetId: (state, action) => {
      state.categorySetId = action.payload;
    },
  },
});

export const {
  setInventoryId,
  setCategorySetId,
} = inventorySlice.actions;

export const selectInventoryId = state => state.inventory.inventoryId;
export const selectCategorySetId = state => state.inventory.categorySetId;

export default inventorySlice.reducer;
