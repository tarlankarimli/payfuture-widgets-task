import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import widgetReducer from "./slices/widgetSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    widgets: widgetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
