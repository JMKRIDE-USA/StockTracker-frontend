import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { QueryClient } from 'react-query';

import { selectAuthHeader } from '../redux/authSlice.js';
import config from '../config.js';

export const queryClient = new QueryClient();

export function useGetQuery(endpoint, key, {auth = true} = {}) {
  const header = useSelector(selectAuthHeader);
  try {
    const query = useQuery(
      [key, endpoint], // caching invalidations from either
      () => fetch(
        config.backend_url + endpoint,
        {
          method: "GET",
          headers: auth ? header : [],
        }
      ).then(res => res.json()),
    )
    if (query.error) {
      console.log(
        "[!] Error fetching", key, "endpoint \"", endpoint, "\":", query.error
      );
      return query;
    }
    if (query.data && query.data.error){
      console.log(
        "[!] Error fetching", key, "endpoint \"", endpoint, "\":", query.error
      );
      return query;
    }
      return query;
  } catch (error) {
    console.log("[!] Error fetching", key, "endpoint \"", endpoint, "\":", error);
    return { data: {}, error: error, status: 'error'}
  }
}

export function createMutationCall(mutationFn, mutationError, mutationVerb) {
  return async (to_submit) => {
    let result;
    try {
      result = await mutationFn({to_submit})
    } catch (error) {
      console.log("[!] Error", mutationVerb, ":", error);
      return false;
    }
    if (mutationError){
      console.log("[!] Error", mutationVerb, ":", mutationError);
      return false;
    }
    if (result && result.error){
      console.log("[!] Error", mutationVerb, ":", result.error);
      return false;
    }
    if (result) {
      return result;
    }
    return false;
  }
}
