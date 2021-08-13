import React from 'react';

import { useDispatch } from 'react-redux';

import { resetAuth } from '../redux/authSlice.js';
import { PageCard } from '../components/common.js';


function AccessDenied() {
  const dispatch = useDispatch();
  const logout = () => dispatch(resetAuth());

  return (
    <div className="page">
      <PageCard>
        <h1>
          403 Access Denied.
        </h1>
        <div>
          You do no have permission to view this content.
        </div>
        <button className="btn btn-primary" onClick={logout}>Log Out</button>
      </PageCard>
    </div>
  )
}

export default AccessDenied;
