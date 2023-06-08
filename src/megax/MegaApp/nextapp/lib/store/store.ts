import { configureStore } from "@reduxjs/toolkit";
import weatherStore from "./weather.store";

export const store = configureStore({
  reducer: {
    weather: weatherStore,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
