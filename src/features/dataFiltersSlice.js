// src/features/dataFilters/dataFiltersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchFilteredData = createAsyncThunk(
  'dataFilters/fetchFilteredData',
  async (filters, { getState }) => {
    const { ageGroup, gender, startDate, endDate } = filters;

    // Construct query parameters
    const params = new URLSearchParams({
      ageGroup,
      gender,
      startDate,
      endDate,
    }).toString();

    // Update the URL with filter parameters without reloading the page
    const currentUrl = window.location.pathname; // Keeps the current path
    window.history.pushState({}, '', `${currentUrl}?${params}`);

    // Fetch data using Axios
    const response = await axios.get(`${API_BASE_URL}/data`, {
      params: {
        ageGroup,
        gender,
        startDate,
        endDate,
      },
      withCredentials: true,
    });

    return response.data; // Return the data to be used in the reducer
  }
);


const initialState = {
  data: [],            // Stores the chart data
  ageGroup: '15-25',   // Default filter for age group
  gender: 'male',      // Default filter for gender
  startDate: null,     // Start date for date range
  endDate: null,
  loading: false,
  error: null,       // End date for date range
};

const dataFiltersSlice = createSlice({
  name: 'dataFilters',
  initialState,
  reducers: {
    setAgeGroup: (state, action) => {
      state.ageGroup = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
    extraReducers: (builder) => {
        builder
          .addCase(fetchFilteredData.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchFilteredData.fulfilled, (state, action) => {
            state.data = action.payload; // Store the fetched data
            state.loading = false;
          })
          .addCase(fetchFilteredData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Handle the error
    
            });
        },
  
});

// Export actions to use in your components
export const { setData, setAgeGroup, setGender, setDateRange } = dataFiltersSlice.actions;

// Export the reducer to include it in the store
export default dataFiltersSlice.reducer;
