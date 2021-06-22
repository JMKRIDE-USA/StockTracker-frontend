import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';

import { selectAuthHeader } from '../redux/authSlice.js';
import {
  selectInventoryId,
  selectCategorySetId,
} from '../redux/inventorySlice.js';
import config from '../config.js';
import { createMutationCall } from './data.js';

import { useGetQuery, queryClient } from './data.js';

function useGetInventoryQuery(endpoint) {
  const inventoryId = useSelector(selectInventoryId);
  return useGetQuery(
    endpoint,
    'inventory', //global key for this file
  );
}

export function useGetPartsByCategory(categoryId) {
  const inventoryId = useSelector(selectInventoryId);
  return useGetInventoryQuery(
    "parts/category/id/" + categoryId + "/inventory/id/" + inventoryId,
  );
}

export function useGetAllCategories() {
  const categorySetId = useSelector(selectCategorySetId);
  return useGetInventoryQuery("categories/categoryset/id/" + categorySetId);
}
