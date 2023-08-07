import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { googleSignIn } from "../apis/signin.api";

export interface AuthState {
  loading: boolean;
  error?: string;
}

const initialState: AuthState = {
  loading: false,
};

export const googleSignInThunk = createAsyncThunk(
  "auth/google-sign-in",
  async (idToken: string, _thunkApi) => {
    return await googleSignIn(idToken);
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(googleSignInThunk.fulfilled, (state, action) => {
      state.loading = false;
    });
  },
});

export const { setLoading } = authSlice.actions;

export default authSlice.reducer;
