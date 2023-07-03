import { configureStore } from '@reduxjs/toolkit'
import signinSlice from './signin.slice'
import signupSlice from './signup.slice'
import homeSlice from './home.slice'
import userSlice from './user.slice'
import userDetailSlice from "./userDetail.slice";

const store = configureStore({
  reducer: {
    signinSlice,
    homeSlice,
    signupSlice,
    userSlice,
    userDetailSlice,
  },
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
