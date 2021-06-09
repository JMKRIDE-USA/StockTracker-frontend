import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice.js';

import asyncListenerMiddleware from './asyncListenerMiddleware.js';
import authALM from './authALM.js';

const persistConfig = {key: 'root', storage, whitelist: ['auth']}; 
const rootReducer = combineReducers({
  auth: authReducer,
});

export default configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }).concat(asyncListenerMiddleware(authALM))
});