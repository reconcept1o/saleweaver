import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notificationReducer from "./notificationSlice.js"; // 1. Import the new reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer, // 2. Add the new reducer to the store
  },
});

export default store;
