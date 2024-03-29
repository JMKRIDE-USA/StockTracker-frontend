import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';

import { selectAuthHeader } from '../redux/authSlice.js';
import config from '../config.js';
import { createMutationCall } from './data.js';
import {
  setUserId,
  setAuthTokens,
  fetchAuthRequest,
} from '../redux/authSlice.js'
import { getDateAfter } from './date.js';
import { useGetQuery, queryClient } from './data.js';


function useGetAuthQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'auth', //global key for this file
    options,
  )
}

export function useCreateAccount(){

  let dispatch = useDispatch();
  let login = useLogin();

  const { mutateAsync, error } = useMutation(({to_submit}) => fetch(
    config.backend_url + "users/create",
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(to_submit),
    }).then(res => res.json()),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('users');
      }
    },
  );

  return async (to_submit) => {
    let result;
    try {
      result = await mutateAsync({to_submit})
    } catch (error) {
      console.log("[!] Error creating account:", error);
      return false;
    }
    if (error){
      console.log("[!] Error creating account:", error);
      return false;
    }
    if (result && result.error){
      console.log("[!] Error creating account:", result.error);
      return false;
    }
    if (result && result.id) {
      dispatch(setUserId(result.id));
      return login({email: to_submit.email, password: to_submit.password});
    }
    return false;
  }
}

export function useLogin(options = {}){
  let dispatch = useDispatch();

  const { mutateAsync, status, error } = useMutation((to_submit) => fetch(
    config.backend_url + "auth",
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(to_submit),
    }).then(res => res.json()),
    options,
  );

  return async ({email, password}) => {
    let to_submit = {email: email, password: password};
    let result;
    try {
      result = await mutateAsync(to_submit)
    } catch (error) {
      console.log("[!] Error logging in:", error);
      return false;
    }
    if (status === 'error'){
      console.log("[!] Error logging in:", error);
      return false;
    }
    if (result && result.error) {
      console.log("[!] Error logging in:", result.error);
      return false;
    }
    if (result && result.accessToken && result.refreshToken && result.expiresIn) {
      dispatch(setAuthTokens({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
        expires_at: getDateAfter(result.expiresIn),
      }));
      dispatch(fetchAuthRequest());
      return true;
    }
    console.log("[!] Error logging in:", "[unknown]");
    return false
  };
}

export function useGetSessions() {
  return useGetAuthQuery("auth/sessions/self", {version: "v2"});
}

export function useDisableSession(){
  const header = useSelector(selectAuthHeader);

  const mutationFn  = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "auth/sessions/id/" + to_submit.session_id,
      {
        method: "DELETE",
        headers: header,
      }
    ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('auth');
      },
    }
  );

  return createMutationCall(mutationFn, "disabling session");
}

export function useAdminResetUserPassword(userId, options = {}){
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "auth/reset_password/admin",
      {
        method: "POST",
        headers: {
          ...header,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(to_submit),
      }),
    options,
  );
  return createMutationCall(mutationFn, "resetting password with admin priviledges");
}

export function useDeleteUser(userId, options = {}) {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/id/" + userId,
      {
        method: "DELETE",
        headers: header,
      }),
    options,
  );
  return createMutationCall(mutationFn, "deleting user");
}

export function useCreateUser(options = {}) {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/create",
      {
        method: "POST",
        headers: {
          ...header,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(to_submit),
      }),
    options,
  );
  return createMutationCall(mutationFn, "creating user");
}


export function useGetAllUsers() {
  return useGetAuthQuery("users/all", {version: "v2"});
}

export function useGetUser(id) {
  return useGetAuthQuery("users/id/" + id, {version: "v2"});
}

export function usePatchUser(userId, options = {}) {
  const header = useSelector(selectAuthHeader);
  const mutationFn = useMutation(
    ({to_submit}) => fetch(
      config.backend_url + "users/id/" + userId,
      {
        method: "PATCH",
        headers: {
          ...header,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(to_submit),
      }),
    options,
  );
  return createMutationCall(mutationFn, "patching user");
}
