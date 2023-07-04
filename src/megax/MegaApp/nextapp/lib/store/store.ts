import { configureStore } from "@reduxjs/toolkit";
import weatherStore from "./weather.state";
import usersStore from "./users.state";
import devicesStore from "./devices.state";
import userDevicesStore from "./userDevice.state";

export const store = configureStore({
  reducer: {
    weather: weatherStore,
    users: usersStore,
    devices: devicesStore,
    userDevice: userDevicesStore,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
