import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

import { selectAuthHeader } from '../redux/authSlice.js';
import {
  selectInventoryId,
  selectCategorySetId,
} from '../redux/inventorySlice.js';
import config from '../config.js';
import { createMutationCall } from './data.js';

import { useGetQuery, queryClient } from './data.js';

function useGetInventoryStructureQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'structure-inventory', //global key for this file
    options,
  );
}

function useGetInventoryQuantityQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'quantity-inventory', //global key for this file
    options,
  );
}

/*
 * noQuantity - use structural cache. 
 *  Quantities returned when this is true are invalid
 */
export function useGetPartsByCategory(categoryId, { noQuantity = false } = {}) {
  const inventoryId = useSelector(selectInventoryId);
  const getterFn = noQuantity 
    ? useGetInventoryStructureQuery 
    : useGetInventoryQuantityQuery;
  return getterFn(
    "parts/category/id/" + categoryId + "/inventory/id/" + inventoryId,
    {enabled: !!inventoryId},
  );
}

export function useGetAllCategories() {
  const categorySetId = useSelector(selectCategorySetId);
  return useGetInventoryStructureQuery(
    "categories/categoryset/id/" + categorySetId,
    {enabled: !!categorySetId}
  );
}
export function useGetCategory(categoryId) {
  return useGetInventoryStructureQuery("category/id/" + categoryId);
}

export const useGetAllInventories = () =>
  useGetInventoryStructureQuery("inventories/all");

export const useGetAllCategorySets = () =>
  useGetInventoryStructureQuery("categorySets/all");

export const useGetPart = (partId, { withQuantity = true } = {}) => {
  const inventoryId = useSelector(selectInventoryId);
  return useGetInventoryQuantityQuery(
    "part/id/" + partId + (withQuantity ? "/inventory/id/" + inventoryId : "")
  );
}
  

export const useSetInventory = () => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/defaults/inventory/id/" + to_submit.id,
      {method: "POST", headers: header}
    ),
    {onSuccess: async () => queryClient.invalidateQueries('structure-inventory')}
  );
  return createMutationCall(mutationFn, "setting user inventory")
}

export const useAdjustPartQuantity = ({partId}, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const inventoryId = useSelector(selectInventoryId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      (config.backend_url 
        + "part/id/" + partId 
        + "/inventory/id/" + inventoryId
      ), {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => queryClient.invalidateQueries('quantity-inventory'),
    }
  );
  return createMutationCall(mutationFn, "adjusting part quantity");
}

export const useGetLogsByCategory = ({categoryId}) =>
  useGetInventoryQuantityQuery("logs/category/id/" + categoryId);

export const useGetLogsByPart = ({partId}) =>
  useGetInventoryQuantityQuery("logs/part/id/" + partId);

export const useSetCategoryOrder = (categoryId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "category/id/" + categoryId,
      {
        method: "POST", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => queryClient.invalidateQueries('structure-inventory'),
    }
  );
  return createMutationCall(mutationFn, "persisting category part order");
}
