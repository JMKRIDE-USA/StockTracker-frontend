import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { QueryLoader } from '../modules/data.js';
import { PageCard, TitleCard } from '../components/common.js';
import { ISOToReadableString } from '../modules/date.js';
import { InfoListFromObject } from '../components/lists.js';
import { PageableLogTable } from '../components/tables/logs.js';
import {
  selectAuthState,
  selectUserId,
  selectUserInfo,
  resetAuth,
} from '../redux/authSlice.js';
import { authStateToString } from '../constants.js';
import { useGetSessions, useDisableSession } from '../modules/auth.js';

const SessionListStyle = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-top: 2px solid black;
    margin-top: 10px;
    & > button {
      margin-left: 20px;
    }
  }
  & > *:first-child {
    border-top: 0px solid black;
    margin-top: 0px;
  }
`

function SessionsList({sessions}) {
  const disableSession = useDisableSession();
  const dispatch = useDispatch();

  let validSessions = sessions.filter(
    item => (
      Object.hasOwnProperty.call(item, "lastUsedIP") && item.lastUsedIP
      && Object.hasOwnProperty.call(item, "lastUsedDate") && item.lastUsedDate
    )
  )
  let sessionsData = validSessions.map(item => ({ 
    "Last Seen": ISOToReadableString(item.lastUsedDate),
    "At": item.lastUsedIP.replace('::ffff:',''),
  }));

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
    <SessionListStyle>
      { validSessions.map((item, index) =>
        <div key={index}>
          <InfoListFromObject data={sessionsData[index]}/>
          <button className="btn btn-secondary" onClick={disableSessionOnClick({id: item.id, current: item.current})}>
            {item.current ? "Log Out" : "Delete" }
          </button>
        </div>
      )}
    </SessionListStyle>
  );
}

function Profile() {
  const userInfo = useSelector(selectUserInfo);
  const userId = useSelector(selectUserId);
  const authState = useSelector(selectAuthState);
  const sessionsQuery = useGetSessions();

  return (
    <div className="page">
      <TitleCard title={userInfo.firstName + "'s Profile" }>
        <InfoListFromObject
          data={{
            "User ID": userId,
            Name: userInfo.fullName,
            Email: userInfo.email,
            Permissions: authStateToString(authState),
            Created: ISOToReadableString(userInfo.createdAt),
          }}
        />
      </TitleCard>
      <PageCard>
        <h1>
          {userInfo.firstName + "'s Active Sessions" }
        </h1>
        <QueryLoader query={sessionsQuery} propName={"sessions"}>
          <SessionsList/>
        </QueryLoader>
      </PageCard>
      <PageCard>
        <h3>{"All " + userInfo.firstName + "'s Activity"}</h3>
        <PageableLogTable endpoint={"logs/user/id/" + userId} pageCard={false}/>
      </PageCard>
    </div>
  )
}

export default Profile;
