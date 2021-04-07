import { createSlice } from '@reduxjs/toolkit';
// import { createSelector } from 'reselect';

const initialState = {
  error: {
    isError: null,
    errorMessage: null,
  },
  isLoading: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    dashboardLoadingFailure: (state, action) => ({
      ...state,
      error: {
        ...state.error,
        isError: true,
        errorMessage: action.payload.message,
      },
    }),
  },
});

export const {
  dashboardLoadingFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
