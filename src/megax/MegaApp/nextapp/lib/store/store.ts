import { configureStore } from "@reduxjs/toolkit";
import weatherStore from "./weather.state";
import userStore from "./user.state";

export const store = configureStore({
  reducer: {
    weather: weatherStore,
    user: userStore,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
