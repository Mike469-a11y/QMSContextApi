import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import qmsReducer from './slices/qmsSlice.js';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
    qms: qmsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

export default store;