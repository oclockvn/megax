import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Result, UserLoginResponse } from "../lib/models/login.model";
import { login } from "../lib/apis/signin.api";

export interface SignInState {
  errorMessage: string;
  isAuthenticated: boolean;
  authToken: string;
}

type LoginRequest = {
  username: string;
  password: string;
};

export const userLoginThunk = createAsyncThunk(
  "auth/userLogin",
  async (request: LoginRequest) => {
    return await login(request.username, request.password);
  }
);

const signinState: SignInState = {
  errorMessage: "",
  isAuthenticated: false,
  authToken: "",
};

export const signinSlice = createSlice({
  name: "signin",
  initialState: signinState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => {},
  },
  extraReducers: builder =>
    builder.addCase(
      userLoginThunk.fulfilled,
      (
        state: SignInState,
        action: PayloadAction<Result<UserLoginResponse>>
      ) => {
        const {
          payload: {
            isSuccess,
            data: { token },
          },
        } = action;

        if (isSuccess) {
          // update state
          state.isAuthenticated = true;
          state.authToken = token;
        } else {
          state.isAuthenticated = false;
          state.errorMessage = "Invalid username or password";
        }
      }
    ),
});

export const { increment } = signinSlice.actions;
export default signinSlice.reducer;
