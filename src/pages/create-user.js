import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { QueryLoader } from '../modules/data.js';
import { TitleCard } from '../components/common.js';
import { permissionLevelToAuthState, authStateToString } from '../constants.js';
import { ObjectForm, TextComponent } from '../components/object-form.js';
import { PermissionSelector } from '../components/selectors.js';
import { useCreateUser, usePatchUser, useGetUser } from '../modules/auth.js';
import { BackButton } from '../components/buttons.js'


const getStateList = (user) => ([
  {
    key: "firstName", label: "First Name",
    initialState: user ? user.firstName : "",
    component: TextComponent("First Name"),
    formatFn: _=>_,
  },
  {
    key: "lastName", label: "Last Name",
    initialState: user ? user.lastName : "",
    component: TextComponent("Last Name"),
    formatFn: _=>_,
  },
  {
    key: "email", label: "Email",
    initialState: user ? user.email : "",
    component: TextComponent("User's Email"),
    formatFn: _=>_,
  },
  {
    key: "permissionLevel", label: "Permissions",
    initialState: user 
      ? ({
          value: permissionLevelToAuthState(user.permissionLevel),
          label: authStateToString(permissionLevelToAuthState(user.permissionLevel)),
        }) 
      : undefined,
    component: PermissionSelector,
    formatFn: c => c.value,
  },
  {
    key: "password", label: "Password",
    initialState: "",
    component: TextComponent("New Password", {type: "password"}),
    formatFn: _=>_,
    optional: true,
  },
  {
    key: "password2", label: "Repeat Password",
    initialState: "",
    component: TextComponent("Password Again", {type: "password"}),
    formatFn: _=>_,
    optional: true,
  },
])

const makePreProcessData = (isNewUser) => (data) => {
  let errors = [];
  if(isNewUser && !(data.password && data.password2)) {
    errors.push(["New users need to set password"])
  }
  if(data.password !== data.password2) {
    errors.push(["Passwords do not match!"])
  }
  if(!data.password) {
    delete data.password
  }
  delete data.password2
  return [data, errors];
}

function CreateUserForm() {
  const stateList = getStateList();
  const useMakeSubmitFn = (options) =>
    useCreateUser(options);
  const preProcessData = makePreProcessData(true);
  return (
    <ObjectForm buttonText="Submit" {...{stateList, useMakeSubmitFn, preProcessData}}/>
  )
}

function EditUserForm({user}){
  const history = useHistory()
  const backToUser = useCallback(
    () => history.push('/user/' + user._id),
    [history, user]
  );
  const stateList = getStateList(user);
  const useMakeSubmitFn = (options) =>
    usePatchUser(user._id, options);
  const preProcessData = makePreProcessData(false);
  return (
    <ObjectForm
      formStyle={{marginTop: 15}}
      buttonText="Save"
      {...{stateList, useMakeSubmitFn, preProcessData}}
    >
      <BackButton onClick={backToUser}/>
    </ObjectForm>
  )
}

export default function CreateUserPage() {
  const { id } = useParams();
  const userQuery = useGetUser(id);
  return (
    <div className="page">
      <TitleCard title={id ? "Edit User" : "Create User"}/>
      {id 
        ? <QueryLoader query={userQuery} propName="user">
          <EditUserForm/>
        </QueryLoader>
        : (
        <CreateUserForm/>
      )}
    </div>
  )
}
