
import { configureStore } from '@reduxjs/toolkit';
import dataFiltersReducer from './features/dataFiltersSlice';
import userSlice from './features/authSlice';

const store = configureStore({
  reducer: {
    dataFilters: dataFiltersReducer, // Add your slice reducer
    userSlice: userSlice,
  },
});

export default store;
