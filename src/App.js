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
import ReorderCategory from './pages/reorder-category.js';
import CreateCategory from './pages/create-category.js';
import Part from './pages/part.js';
import Home from './pages/home.js';
import NotFound from './pages/404.js';
import AccessDenied from './pages/403.js'
import CompleteSet from './pages/complete-set.js';
import CreatePart from './pages/create-part.js';
import CreateCompleteSet from './pages/create-completeset.js';
import ReorderCSSet from './pages/reorder-csset.js';
import CreateCSSet from './pages/create-csset.js';
import CreateCategorySet from './pages/create-categoryset.js';
import ReorderCategorySet from './pages/reorder-categoryset.js';
import AllLogsPage from './pages/logs.js';
import WithdrawCustomSetPage from './pages/withdraw-custom-cs.js';
import SettingsPage from './pages/settings.js';

function PageSwitch() {
  return (
    <Switch>
      <Route exact path="/profile" component={Profile}/>
      <Route exact path="/category/:id" component={Category}/>
      <Route exact path="/reorder-category/:id" component={ReorderCategory}/>
      <Route exact path="/edit-category/:id" component={CreateCategory}/>
      <Route exact path="/create-category" component={CreateCategory}/>
      <Route exact path="/part/:id" component={Part}/>
      <Route exact path="/part" component={Part}/>
      <Route exact path="/edit-part/:id" component={CreatePart}/>
      <Route exact path="/create-part" component={CreatePart}/>
      <Route exact path="/completeset/:id" component={CompleteSet}/>
      <Route exact path="/completeset" component={CompleteSet}/>
      <Route exact path="/edit-completeset/:id" component={CreateCompleteSet}/>
      <Route exact path="/create-completeset" component={CreateCompleteSet}/>
      <Route exact path="/withdraw-custom-completeset" component={WithdrawCustomSetPage}/>
      <Route exact path="/reorder-csset/:id" component={ReorderCSSet}/>
      <Route exact path="/create-csset" component={CreateCSSet}/>
      <Route exact path="/edit-csset/:id" component={CreateCSSet}/>
      <Route exact path="/create-categoryset" component={CreateCategorySet}/>
      <Route exact path="/edit-categoryset/:id" component={CreateCategorySet}/>
      <Route exact path="/reorder-categoryset/:id" component={ReorderCategorySet}/>
      <Route exact path="/logs" component={AllLogsPage}/>
      <Route exact path="/settings" component={SettingsPage}/>
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
