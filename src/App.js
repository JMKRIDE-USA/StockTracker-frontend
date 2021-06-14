import React, { useEffect } from 'react';
import logo from './assets/JMKRIDE_RWU_BlackBG.svg';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { HiUserCircle } from 'react-icons/hi';
import { QueryClientProvider } from 'react-query';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import store from './redux/store.js';
import {
  selectAuthState,
  selectAccessToken,
  fetchAuthRequest
} from './redux/authSlice.js';
import { queryClient } from './modules/data.js';

import SignIn from './pages/sign-in.js';
import Profile from './pages/profile.js';
import Home from './pages/home.js';
import NotFound from './pages/404.js';
import AccessDenied from './pages/403.js'

function PageSwitch() {
  return (
    <Switch>
      <Route exact path="/profile" component={Profile}/>
      <Route exact path="/" component={Home}/>
      <Route component={NotFound}/>
    </Switch>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  useEffect(
    () => dispatch(fetchAuthRequest()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const auth_state = useSelector(selectAuthState);
  const access_token = useSelector(selectAccessToken);

  let ContentComponent = (() => {
    if(auth_state > 0) { // At least read permissions
      return PageSwitch;
    } else if (access_token) { // No read permissions
      return AccessDenied;
    }
    return SignIn; // Not logged in.
  })();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar className="header" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand href="/">
            <img
              src={logo}
              className="header-logo d-inline-block align-top"
              alt="JMKRIDE logo"
             />
          </Navbar.Brand>
          <Navbar.Toggle className="header-toggle"/>
          <Navbar.Collapse className="header-dropdown">
            <div>
              <Nav.Link href="/">Home</Nav.Link>
            </div>
            <div>
              <Nav.Link className="ml-auto" href="/profile">
                <HiUserCircle className="account-icon" size={40}/>
              </Nav.Link>
            </div>
          </Navbar.Collapse>
        </Navbar>
        <ContentComponent/>
      </BrowserRouter>
    </div>
  );
}

function App() {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent/>
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
