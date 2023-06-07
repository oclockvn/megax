import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login } from '../lib/apis/signin.api'
import { UserLoginResponse, Result } from '../lib/models/login.model'


export interface SignInState {
  errorMessage: string,
  isAuthenticated: boolean,
  authToken: string
}

type LoginRequest = {
  username: string,
  password: string

}

export const userLoginThunk = createAsyncThunk(
  'auth/userLogin',
  async (request: LoginRequest) => {
    return await login(request.username, request.password)
  }
)

const signinState: SignInState = {
  errorMessage: '',
  isAuthenticated: false,
  authToken: ''

}

export const signinSlice = createSlice({
  name: 'signin',
  initialState: signinState,
  reducers: {

  },
  extraReducers: builder => builder.addCase(
    userLoginThunk.fulfilled, (
      state: SignInState,
      action: PayloadAction<Result<UserLoginResponse>>
    ) => {
    const {
      payload: { isSuccess, data: { token }, },

    } = action

    if (isSuccess) {
      state.isAuthenticated = true
      state.authToken = token
    } else {
      state.isAuthenticated = false
      state.errorMessage = "Invalid username or password";
    }
  }
  )

})

// export const { increment } = signinSlice.actions;

export default signinSlice.reducer
