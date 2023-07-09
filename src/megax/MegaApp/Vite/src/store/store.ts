import { configureStore } from '@reduxjs/toolkit'
import signinSlice from './signin.slice'
import signupSlice from './signup.slice'
import homeSlice from './home.slice'
import userSlice from './user.slice'
import deviceSlice from "./device.slice";

const store = configureStore({
  reducer: {
    signinSlice,
    homeSlice,
    signupSlice,
    userSlice,
    deviceSlice,
  },
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
