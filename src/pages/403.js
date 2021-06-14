import React from 'react';

import { useDispatch } from 'react-redux';

import { resetAuth } from '../redux/authSlice.js';


function AccessDenied() {
  const dispatch = useDispatch();
  const logout = () => dispatch(resetAuth());

  return (
    <div className="page">
      <div className="page-card">
        <h1>
          403 Access Denied.
        </h1>
        <div>
          You do no have permission to view this content.
        </div>
        <button className="btn btn-primary" onClick={logout}>Log Out</button>
      </div>
    </div>
  )
}

export default AccessDenied;
