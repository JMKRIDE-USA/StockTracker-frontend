import React, { useState } from 'react';

import { useLogin } from '../modules/auth.js';


function SignInForm() {
  const login = useLogin();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let success = await login({email, password});
    console.log(success);
  }

  return (
    <form onSubmit={onSubmit} className="sign-in-form form-group">
      <h4 className="flex-align-center">Sign In</h4>
      <input
        className="form-control"
        type="email" name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
      <input
        className="form-control"
        type="password" name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
       />
      <button className="btn btn-primary flex-align-center">Sign In</button>
    </form>
  );
}

function SignIn() {
  return (
    <div className="page">
      <div className="page-card">
        <h1>
          JMKRIDE Stocktracker
        </h1>
        <div className="text body-text text-center">
          You are logged out. Please sign in again.
        </div>
      </div>
      <div className="page-card">
        <SignInForm/>
      </div>
    </div>
  )
}

export default SignIn;
