import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Result } from '../lib/models/common.model'
import { signup } from '../lib/apis/signup.api'
import { UserSignupResponse } from '../lib/models/signup.model'


export interface SignupState {
  errorMessage: string,
  successMessage: string,
  isRegister: boolean,

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

const signupState: SignupState = {
  errorMessage: '',
  successMessage: '',
  isRegister: false,


}

export const signupSlice = createSlice({
  name: 'signup',
  initialState: signupState,
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
      state.isRegister = true
      state.successMessage = 'Register success!'


    } else {
      state.isRegister = false
      state.errorMessage = "User already exist!";

    }

  }
  )

})


export default signupSlice.reducer
