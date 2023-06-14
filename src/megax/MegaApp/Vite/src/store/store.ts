import { configureStore } from '@reduxjs/toolkit'
import signinSlice from './signin.slice'
import signupSlice from './signup.slice'
import homeSlice from './home.slice'
import usersSlice from './users.slice'
import searchUserSlice from './searchUser.slice'
import pageUsersSlice from './pageUsers.slice'



const store = configureStore({
  reducer: {
    signinSlice,
    homeSlice,
    signupSlice,
    usersSlice,
    searchUserSlice,
    pageUsersSlice
  }
})


export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store