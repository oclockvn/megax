import { configureStore } from '@reduxjs/toolkit'
import signinSlice from './signin.slice'
import signupSlice from './signup.slice'
import homeSlice from './home.slice'
import userSlice from "./users.slice";
import deviceSlice from "./devices.slice";
import userDeviceSlice from "./userDevice.slice";
import suppliersSlice from "./suppliers.slice";

const store = configureStore({
  reducer: {
    signinSlice,
    homeSlice,
    signupSlice,
    userSlice,
    deviceSlice,
    userDeviceSlice,
    suppliersSlice,
  },
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
