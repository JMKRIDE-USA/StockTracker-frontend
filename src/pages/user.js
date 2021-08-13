import React, { useCallback } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { TitleCard, PageCard } from '../components/common.js';
import { QueryLoader } from '../modules/data.js';
import { useGetUser } from '../modules/auth.js';
import { InfoListFromObject } from '../components/lists.js';
import { ISOToReadableString } from '../modules/date.js';
import { AllUserTable } from '../components/tables/users.js';
import { permissionLevelToAuthState, authStateToString } from '../constants.js';
import { useDeleteUser } from '../modules/auth.js';
import { useGetResultIndicator } from '../components/result.js';
import { CreateButton, DeleteButton, BackButton } from '../components/buttons.js';

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
  const { setSubmitting, options, render } = useGetResultIndicator({
    onSuccess: backToUsers,
  });
  const deleteUser = useDeleteUser(user._id, options);
  const onDeleteClick = () => {
    setSubmitting(true);
    deleteUser();
  }

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
          <DeleteButton onClick={onDeleteClick}/>
          {render()}
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
