import React, { useState, useEffect } from 'react';

import { useLogin, PageCard, DisableCover, LoadingIcon, ResultIndicator } from 'jeffdude-frontend-helpers';


function SignInForm() {

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(undefined);
  const login = useLogin({
    onSettled: result => {
      setSubmitting(false);
      setSubmissionResult(!!result && !!result?.accessToken);
    }
  });
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => setSubmissionResult(undefined),
      (submissionResult ? 1000 : 5000)
    )
  }, [submissionResult, setSubmissionResult]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    await login({email, password});
  }

  return (
    <PageCard style={{position: "relative"}}>
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
        <button className="btn btn-primary flex-align-center sign-in-button">Sign In</button>
      </form>
      {(submitting || (submissionResult !== undefined)) &&
        <DisableCover>
          {submitting && <LoadingIcon size={50} color="white"/>}
          {(submissionResult !== undefined) && 
            <ResultIndicator dark result={submissionResult}/>
          }
        </DisableCover>
      }
    </PageCard>
  );
}

function SignIn() {
  return (
    <div className="page">
      <PageCard>
        <h1>
          JMKRIDE Stocktracker
        </h1>
        <div className="text body-text text-center">
          You are logged out. Please sign in again.
        </div>
      </PageCard>
      <SignInForm/>
    </div>
  )
}

export default SignIn;
