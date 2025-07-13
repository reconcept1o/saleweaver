import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Async Thunk: Backend'den bildirimleri çeker
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/notification");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Gerçek zamanlı gelen bildirimi listenin en başına ekler
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    // Bildirimleri okundu olarak işaretler (şimdilik sadece frontend'de)
    markAsRead: (state, action) => {
      const { id } = action.payload;
      const existingNotification = state.items.find((item) => item.id === id);
      if (existingNotification) {
        existingNotification.read = true; // 'read' diye bir alanınız varsa
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addNotification, markAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
