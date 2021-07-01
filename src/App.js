import React, { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { QueryClientProvider } from 'react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import store from './redux/store.js';
import {
  selectAuthState,
  selectAccessToken,
  fetchAuthRequest
} from './redux/authSlice.js';
import { queryClient } from './modules/data.js';

import Header from './components/header.js';
import SignIn from './pages/sign-in.js';
import Profile from './pages/profile.js';
import Category from './pages/category.js';
import EditCategory from './pages/edit-category.js';
import Part from './pages/part.js';
import Home from './pages/home.js';
import NotFound from './pages/404.js';
import AccessDenied from './pages/403.js'

function PageSwitch() {
  return (
    <Switch>
      <Route exact path="/profile" component={Profile}/>
      <Route exact path="/category/:id" component={Category}/>
      <Route exact path="/category/edit/:id" component={EditCategory}/>
      <Route exact path="/part/:id" component={Part}/>
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
        <Header/>
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
          <DndProvider backend={HTML5Backend} debugMode={true}>
            <AppContent/>
          </DndProvider >
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
