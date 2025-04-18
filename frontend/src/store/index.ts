import { configureStore } from '@reduxjs/toolkit';
import containerReducer from './containerSlice';

export const store = configureStore({
  reducer: {
    containers: containerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
