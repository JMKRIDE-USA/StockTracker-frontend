import React from 'react';

import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { QueryClient } from 'react-query';

import { selectAuthHeader } from '../redux/authSlice.js';
import config from '../config.js';

export const queryClient = new QueryClient();


export function useGetQuery(endpoint, key, options = {}) {
  const header = useSelector(selectAuthHeader);
  try {
    const query = useQuery(
      [key, endpoint], // caching invalidations from either
      () => fetch(
        config.backend_url + endpoint,
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
  if(query.status === 'loading') {
    return (
      <div className={"query-loading" + pageCard ? "page-card" : ""}>
        {name} loading...
      </div>
    )
  }
  if(
    query.status !== 'success' || 
    !Object.hasOwnProperty.call(query.data, 'result')
  ) {
    return (
      <div className={"query-error" + pageCard ? "page-card" : ""}>
        <h3 className="error-text">Error loading {name}!</h3>
        { JSON.stringify(query.error) }
      </div>
    );
  }
  return thenFn(query.data);
}

export function QueryLoader({query, propName, children, ...props}) {
  const propNoun = propName.charAt(0).toUpperCase() + propName.slice(1);
  return onQuerySuccess(query, (data) => {
    if(!data.result) {
      return (
        <div className="page-card">
          <h3>{propNoun} Not Found.</h3>
        </div>
      );
    }
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {[propName]: data.result, ...props})
      }
      return child;
    });
  }, {name: propNoun});
}
