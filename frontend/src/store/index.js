import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboard.store';

export default configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
