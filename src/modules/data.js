import React from 'react';

import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { QueryClient } from 'react-query';

import { OptionalCard } from '../components/common.js';
import { InfoListFromObject } from '../components/lists.js';
import { selectAuthHeader } from '../redux/authSlice.js';
import config from '../config.js';

export const queryClient = new QueryClient();


export function useGetQuery(endpoint, key, { version = "v1", ...options } = {}) {
  const header = useSelector(selectAuthHeader);
  // caching invalidations from either
  const cache = Array.isArray(key) ? key.concat(endpoint) : [key, endpoint];
  try {
    const query = useQuery(
      cache,
      () => fetch(
        (version === "v1" ? config.backend_url : config.backend_url_v2) + endpoint,
        {
          method: "GET",
          headers: header,
        },
      ).then(res => res.json()),
      options,
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

export function createMutationCall(mutationFn, mutationVerb) {
  const { mutateAsync, error, status } = mutationFn;
  return async (to_submit) => {
    let result;
    try {
      result = await mutateAsync({to_submit})
    } catch (error) {
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (error){
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (!result || result.error || !result.ok){
      console.log("[!] Error", mutationVerb, ":", result.status, result?.error);
      return {result: false, status};
    }
    if (result) {
      return {result, status};
    }
    return {result: false, status};
  }
}

export function onQuerySuccess(query, thenFn, {name = "Resource", pageCard = false} = {}) {
  if(query.status === 'loading' || query.status === 'idle') {
    return (
      <OptionalCard pageCard={pageCard}>
        {name} loading...
      </OptionalCard>
    )
  }
  if(
    query.status !== 'success' || 
    !Object.hasOwnProperty.call(query.data, 'result')
  ) {
    console.log("[QueryLoader][" + name + "]",
      {
        status: query.status, error: JSON.stringify(query.error),
        data: query.data,
      },
    )
    return (
      <OptionalCard pageCard={pageCard}>
        <h3 className="error-text">Error loading {name}!</h3>
        <InfoListFromObject data={{
          status: query.status,
          error: JSON.stringify(query.error) ,
          data: query.data 
            ? JSON.stringify(query.data).slice(0, 50) + "..."
            : query.data,
        }}/>
      </OptionalCard>
    )
  }
  return thenFn(query.data);
}

export function QueryLoader({query, propName, pageCard, children, ...props}) {
  return onQuerySuccess(query, (data) => {
    if(!data.result) {
      return (
        <OptionalCard pageCard={pageCard}>
          <h3>{propName} Not Found.</h3>
        </OptionalCard>
      );
    }
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {[propName]: data.result, ...props})
      }
      return child;
    });
  }, {name: propName, pageCard});
}
