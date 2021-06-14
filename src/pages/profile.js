import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { ISOToReadableString } from '../modules/date.js';
import { InfoListFromObject } from '../components/lists.js';
import {
  selectAuthState,
  selectUserId,
  selectUserInfo,
  resetAuth,
} from '../redux/authSlice.js';
import { authStateToString } from '../constants.js';
import { useGetSessions, useDisableSession } from '../modules/auth.js';


function SessionsList() {
  const sessionsQuery = useGetSessions();
  const disableSession = useDisableSession();
  const dispatch = useDispatch();

  if (![sessionsQuery].every((query) => query.status === 'success')) {
    return (
      <div> Profile loading... </div>
    )
  }

  let sessionsData = sessionsQuery.data.map(item => (
    { 
      "Last Seen": ISOToReadableString(item.lastUsedDate),
      "At": item.lastUsedIP.replace('::ffff:',''),
    }
  ));

  const disableSessionOnClick = ({id, current}) => (
    () => {
      if(current) {
        dispatch(resetAuth());
      } else {
        disableSession({session_id: id});
      }
    }
  )
  return (
    <div className="session-list">
      { sessionsQuery.data.map((item, index) =>
        <div key={index} className="session-item">
          <InfoListFromObject data={sessionsData[index]}/>
          <button onClick={disableSessionOnClick({id: item.id, current: item.current})}>
            {item.current ? "Log Out" : "Delete" }
          </button>
        </div>
      )}
    </div>
  );
}

function Profile() {
  const userInfo = useSelector(selectUserInfo);
  const userId = useSelector(selectUserId);
  const authState = useSelector(selectAuthState);
  return (
    <div className="page">
      <div className="page-card">
        <h1>
          {userInfo.firstName + "'s Profile" }
        </h1>
        <InfoListFromObject
          data={{
            "User ID": userId,
            Name: userInfo.fullName,
            Email: userInfo.email,
            Permissions: authStateToString(authState),
            Created: ISOToReadableString(userInfo.createdAt),
          }}
        />
      </div>
      <div className="page-card">
        <h1>
          {userInfo.firstName + "'s Active Sessions" }
        </h1>
        <SessionsList/>
      </div>
    </div>
  )
}

export default Profile;
