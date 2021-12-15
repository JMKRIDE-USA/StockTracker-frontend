import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { TitleCard, PageCard } from 'jeffdude-frontend-helpers';
import { QueryLoader } from 'jeffdude-frontend-helpers';
import { useGetUser } from 'jeffdude-frontend-helpers';
import { InfoListFromObject } from 'jeffdude-frontend-helpers';
import { ISOToReadableString } from 'jeffdude-frontend-helpers';
import { AllUserTable } from '../components/tables/users.js';
import { permissionLevelToAuthState, authStateToString } from '../constants.js';
import { useDeleteUser } from 'jeffdude-frontend-helpers';
import { CreateButton, DeleteButton, BackButton } from 'jeffdude-frontend-helpers';

function UserInfoCard({user}) {
  const history = useHistory()
  const backToUsers = useCallback(
    () => history.push('/user'),
    [history]
  );
  const editUser = useCallback(
    () => history.push('/edit-user/' + user._id),
    [history, user]
  );
  const useMakeDeleteFn = (options) => useDeleteUser(user._id, options);

  return (
    <PageCard style={{position: "relative"}}>
      <h3>User: {user.fullName}</h3>
      <InfoListFromObject wide data={{
        ID: user._id,
        "Created At": ISOToReadableString(user.createdAt),
        Permissions: authStateToString(permissionLevelToAuthState(user.permissionLevel)),
        Settings: user.settings,
      }}/>
      <div className="flex-row">
        <div className="flex-row" style={{marginRight: 5}}>
          <DeleteButton useMakeSubmitFn={useMakeDeleteFn} onSuccess={backToUsers}/>
        </div>
        <button className="btn btn-primary" onClick={editUser}>Edit</button>
      </div>
      <BackButton onClick={backToUsers}/>
    </PageCard>
  );
}

function UserLoader({id}) {
  const userQuery = useGetUser(id);
  return (
    <QueryLoader query={userQuery} propName="user" pageCard>
      <UserInfoCard/>
    </QueryLoader>
  );
}

export default function UserPage() {
  const { id } = useParams();
  const history = useHistory()
  const createUser = useCallback(
    () => history.push('/create-user'),
    [history]
  );
  return (
    <div className="page">
      <TitleCard title={id ? "User Page" : "All Users"}>
        {!id && (
          <div className="flex-row">
            Create User:
            <CreateButton onClick={createUser} style={{marginLeft: 10}}/>
          </div>
        )}
      </TitleCard>
      { id
        ? <UserLoader id={id}/>
        : <PageCard>
          <AllUserTable/>
        </PageCard>
      }
    </div>
  )
}
