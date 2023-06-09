import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login } from '../lib/apis/signin.api'
import { UserLoginResponse } from '../lib/models/login.model'
import { Result } from '../lib/models/common.model'
import { signup } from '../lib/apis/signup.api'
import { UserSignupResponse } from '../lib/models/signup.model'



export interface SignupState {
  errorMessage: string,
  isAuthenticated: boolean,
  authToken: string
}

type SignupRequest = {
  username: string,
  password: string,
  name: string

}

export const userSignupThunk = createAsyncThunk(
  'auth/userSignup',
  async (request: SignupRequest) => {
    return await signup(request.username, request.password, request.name)
  }
)

const signinState: SignupState = {
  errorMessage: '',
  isAuthenticated: false,
  authToken: ''

}

export const signinSlice = createSlice({
  name: 'signup',
  initialState: signinState,
  reducers: {

  },
  extraReducers: builder => builder.addCase(
    userSignupThunk.fulfilled, (
      state: SignupState,
      action: PayloadAction<Result<UserSignupResponse>>
    ) => {
    const {
      payload: { isSuccess, data: { SignupRequest }, },


    } = action

    if (isSuccess) {
      state.isAuthenticated = true


    } else {
      state.isAuthenticated = false
      state.errorMessage = "Invalid username or password";

    }

  }
  )

})


export default signinSlice.reducer
