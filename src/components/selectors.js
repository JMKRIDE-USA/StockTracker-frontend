import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { queryClient } from '../modules/data.js';
import {
  setInventoryId,
  selectInventoryId,
  setCategorySetId,
  selectCategorySetId,
} from '../redux/inventorySlice.js';
import {
  useGetAllInventories,
  useGetAllCategorySets,
  useSetInventory,
} from '../modules/inventory.js';


export function GenericSelector({queryFn, onChange, selectedId, name, dark = false}) {
  const query = queryFn();

  if (![query].every((query) => query.status === 'success')) {
    if(query.status === 'error'){
      return (
        <div>
          <div className="error-text">Error loading {name}.</div>
        </div>
      );
    }
    return (
      <div className="loading-text"> Loading {name}... </div>
    )
  }
  if(! Object.hasOwnProperty.call(query.data, 'result')){
    return (
      <div className="page-card">
        <h3 className="error-text">Error loading {name}!</h3>
        { JSON.stringify(query.data) }
      </div>
    );
  }
  const allItems = query.data.result;

  return (
    <select
      className={dark ? "selector-dark" : "selector"}
      onChange={onChange}
      value={selectedId}
    >
      { allItems.map(item => (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}

export function CategorySetSelector() {
  const selectedId = useSelector(selectCategorySetId);
  const dispatch = useDispatch();
  const onChange = (event) => {
    dispatch(setCategorySetId(event.target.value));
    queryClient.invalidateCache('structure-inventory');
  }
  return GenericSelector({
    queryFn: useGetAllCategorySets,
    onChange, selectedId,
    name: 'all categorySets',
  });
}


export function InventorySelector({dark = false} = {}) {
  const selectedId = useSelector(selectInventoryId);
  const dispatch = useDispatch();
  const setInventory = useSetInventory();

  const onChange = (event) => {
    dispatch(setInventoryId(event.target.value));
    setInventory(event.target.value);
    queryClient.invalidateCache('quantity-inventory');
  }
  return GenericSelector({
    queryFn: useGetAllInventories,
    onChange, selectedId,
    name: 'all inventories',
    dark: dark,
  });
}
