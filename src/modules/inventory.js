import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';

import { 
  selectUserId,
  selectAuthHeader,
  fetchAuthRequest,
} from '../redux/authSlice.js';
import {
  selectInventoryId,
  selectCategorySetId,
  selectCSSetId,
  wipeDefaults,
} from '../redux/inventorySlice.js';
import config from '../config.js';
import { createMutationCall } from './data.js';

import { useGetQuery, queryClient } from './data.js';

function useGetInventoryStructureQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'structure-inventory',
    options,
  );
}

function useGetInventoryQuantityQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'quantity-inventory', 
    options,
  );
}

function useGetInventoryCSQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'cs-inventory', 
    options,
  );
}

function useGetInventoryLogQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    ['structure-inventory', 'cs-inventory', 'quantity-inventory'], 
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
    {enabled: !!categoryId && !!inventoryId},
  );
}
export function useGetAllParts(){
  const inventoryId = useSelector(selectInventoryId);
  return useGetInventoryQuantityQuery(
    "part/all/inventory/id/" + inventoryId,
    {enabled: !!inventoryId},
  );
}
export function useSearchAllParts(){
  const inventoryId = useSelector(selectInventoryId);
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "part/search/inventory/id/" + inventoryId,
      {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }),
    {enabled: !!inventoryId}
  );
  return createMutationCall(mutationFn, "searching all parts")
}
export function useCreatePart(options) {
  const header = useSelector(selectAuthHeader);
  const inventoryId = useSelector(selectInventoryId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "part/create/inventory/id/" + inventoryId,
      {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }),
    {...options, enabled: !!inventoryId}
  );
  return createMutationCall(mutationFn, "searching all parts")
}

export function usePatchPart(partId, options) {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "part/id/" + partId,
      {
        method: "PATCH",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }),
    options,
  );
  return createMutationCall(mutationFn, "deleting part")
}
export function useDeletePart(partId, options) {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "part/id/" + partId,
      {
        method: "DELETE",
        headers: header,
      }),
    options,
  );
  return createMutationCall(mutationFn, "deleting part")
}

export function useGetAllCategoriesByCategorySet({categorySetId} = {}) {
  const currentCategorySet = useSelector(selectCategorySetId);
  const activeCategorySetId = categorySetId ? categorySetId : currentCategorySet;
  return useGetInventoryStructureQuery(
    "categories/categoryset/id/" + activeCategorySetId,
    {enabled: !!activeCategorySetId}
  );
}
export const useGetAllCategories = () =>
  useGetInventoryStructureQuery("categories/all");

export function useGetCategory(categoryId) {
  return useGetInventoryStructureQuery("category/id/" + categoryId);
}
export const useGetCategorySetById = (categorySetId) =>
  useGetInventoryStructureQuery("categorySet/id/" + categorySetId);

export const useGetAllInventories = () =>
  useGetInventoryStructureQuery("inventories/all");

export const useGetAllCategorySets = () =>
  useGetInventoryStructureQuery("categorySets/all");

export const useGetAllCSSets = () =>
  useGetInventoryCSQuery("cssets/all");

export const useGetCSSetById = (CSSetId) =>
  useGetInventoryCSQuery("csset/id/" + CSSetId);

export const useGetPart = (partId, { withQuantity = true } = {}) => {
  const inventoryId = useSelector(selectInventoryId);
  return useGetInventoryQuantityQuery(
    "part/id/" + partId + (withQuantity ? "/inventory/id/" + inventoryId : "")
  );
}

export const useSetCSSet = () => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/defaults/csset/id/" + to_submit.id,
      {method: "POST", headers: header}
    ),
    {onSuccess: async () => queryClient.invalidateQueries('cs-inventory')}
  );
  return createMutationCall(mutationFn, "setting user CS Set")
}

export const useSetCategorySet = () => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/defaults/categoryset/id/" + to_submit.id,
      {method: "POST", headers: header}
    ),
    {onSuccess: async () => queryClient.invalidateQueries('structure-inventory')}
  );
  return createMutationCall(mutationFn, "setting user Category Set")
}

export const useSetInventory = () => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/defaults/inventory/id/" + to_submit.id,
      {method: "POST", headers: header}
    ),
    {onSuccess: async () => queryClient.invalidateQueries('quantity-inventory')}
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
      onSuccess: async () => {
        queryClient.invalidateQueries('quantity-inventory')
        queryClient.invalidateQueries('cs-inventory')
      },
    }
  );
  return createMutationCall(mutationFn, "adjusting part quantity");
}

export const useGetLogsByCategory = ({categoryId}) =>
  useGetInventoryQuantityQuery("logs/category/id/" + categoryId);

export const useGetLogsByPart = ({partId}) =>
  useGetInventoryQuantityQuery("logs/part/id/" + partId);

export const useGetLogsEndpoint = (endpoint, options) =>
  useGetInventoryLogQuery(endpoint, options)

export const useSetCategoryOrder = (categoryId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "category-order/id/" + categoryId,
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

export const useSetCategorySetOrder = (categorySetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "categorySet-order/id/" + categorySetId,
      {
        method: "POST", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => queryClient.invalidateQueries('structure-inventory'),
    }
  );
  return createMutationCall(mutationFn, "persisting category set order");
}


export const useGetAllCS = ({CSSet, inCSSet = true} = {}) => {
  const currentCSSet = useSelector(selectCSSetId);
  const csset = CSSet ? CSSet : currentCSSet;
  const inventoryId = useSelector(selectInventoryId);
  const path = inCSSet 
    ? "completesets/csset/id/" + csset + "/inventory/id/" + inventoryId
    : "completesets/inventory/id/" + inventoryId

  return useGetInventoryCSQuery(path,
    {enabled: !!csset && !!inventoryId},
  );
}

export const useGetCSById = (id) => {
  const inventoryId = useSelector(selectInventoryId);
  return useGetInventoryCSQuery(
    "completeset/id/" + id + "/inventory/id/" + inventoryId,
    {enabled: !!id && !!inventoryId},
  );
}

export const useDeleteCS = (id, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      (config.backend_url + "completeset/id/" + id), {
        method: "DELETE",
        headers: header,
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('cs-inventory')
      },
    }
  );
  return createMutationCall(mutationFn, "deleting completeset");
}

export const useAdjustCompleteSetQuantity = ({completeSetId}, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const inventoryId = useSelector(selectInventoryId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      (config.backend_url 
        + "completeset/id/" + completeSetId 
        + "/inventory/id/" + inventoryId
      ), {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('quantity-inventory')
        queryClient.invalidateQueries('cs-inventory')
      },
    }
  );
  return createMutationCall(mutationFn, "adjusting completeset quantity");
}

export const useCreateCompleteSet = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch((
      config.backend_url + "completeset/create"
      ), {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('cs-inventory')
      },
    }
  );
  return createMutationCall(mutationFn, "creating complete set");
}

export const useWithdrawCustomCompleteSet = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const inventoryId = useSelector(selectInventoryId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch((
      config.backend_url + "completeset/withdraw-custom/inventory/id/" + inventoryId
      ), {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('quantity-inventory')
      },
    }
  );
  return createMutationCall(mutationFn, "withdrawing custom complete set");
}

export const usePatchCompleteSet = (completeSetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch((
      config.backend_url + "completeset/id/" + completeSetId
      ), {
        method: "PATCH",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('cs-inventory')
      },
    }
  );
  return createMutationCall(mutationFn, "patching complete set");
}

export const useSetCSSetCSOrder = (CSSetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "csset-order/id/" + CSSetId,
      {
        method: "POST", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => queryClient.invalidateQueries('structure-inventory'),
    }
  );
  return createMutationCall(mutationFn, "persisting CSSet CS order");
}

export const useCreateCSSet = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "csset/create",
      {
        method: "POST", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
        queryClient.invalidateQueries('cs-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "creating CS Set");
}

export const usePatchCSSet = (CSSetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "csset/id/" + CSSetId,
      {
        method: "PATCH", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('cs-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "patching CS Set");
}

export const useDeleteCSSet = (CSSetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const dispatch = useDispatch();
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "csset/id/" + CSSetId,
      {
        method: "DELETE", headers: header,
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('cs-inventory');
        dispatch(wipeDefaults());
        dispatch(fetchAuthRequest());
      },
    },
  );
  return createMutationCall(mutationFn, "deleting CS Set");
}

export const useCreateCategorySet = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "categorySet/create",
      {
        method: "POST", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "creating Category Set");
}

export const usePatchCategorySet = (categorySetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "categorySet/id/" + categorySetId,
      {
        method: "PATCH", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "patching Category Set");
}

export const useDeleteCategorySet = (categorySetId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const dispatch = useDispatch();
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "categorySet/id/" + categorySetId,
      {method: "DELETE", headers: header},
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
        dispatch(wipeDefaults());
        dispatch(fetchAuthRequest());
      },
    },
  );
  return createMutationCall(mutationFn, "deleting category Set");
}

export const usePatchCategory = (categoryId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "category/id/" + categoryId,
      {
        method: "PATCH", headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      }
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "patching category");
}

export const useDeleteCategory = (categoryId, options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "category/id/" + categoryId,
      {method: "DELETE", headers: header},
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "deleting category");
}

export const useCreateCategory = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "category/create",
      {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify(to_submit),
      },
    ), {
      ...options,
      onSuccess: async () => {
        queryClient.invalidateQueries('structure-inventory');
      },
    },
  );
  return createMutationCall(mutationFn, "creating category");
}

export const useSetPartTypeCategories = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const userId = useSelector(selectUserId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "user-settings/user/id/" + userId,
      {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify({partTypeCategories: to_submit}),
      },
    ), {
      ...options,
      enabled: !!userId,
    },
  );
  return createMutationCall(mutationFn, "setting part type categories");
}
export const useSetAuxiliaryParts = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const userId = useSelector(selectUserId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "user-settings/user/id/" + userId,
      {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify({auxiliaryParts: to_submit}),
      },
    ), {
      ...options,
      enabled: !!userId,
    },
  );
  return createMutationCall(mutationFn, "setting auxiliary parts");
}
export const useSetWithdrawAuxiliary = (options = {}) => {
  const header = useSelector(selectAuthHeader);
  const userId = useSelector(selectUserId);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "user-settings/user/id/" + userId,
      {
        method: "POST",
        headers: {...header, 'Content-Type': 'application/json'},
        body: JSON.stringify({withdrawAuxiliaryParts: to_submit}),
      },
    ), {
      ...options,
      enabled: !!userId,
    },
  );
  return createMutationCall(mutationFn, "setting withdraw auxiliary parts");
}
