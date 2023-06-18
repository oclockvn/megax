import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import { fetchUserDetail } from "../apis/user.api";

export interface UserDetailState {
  user?: User;
  isLoading: boolean;
}

const initialState: UserDetailState = {
  user: undefined,
  isLoading: false,
};

export const fetchUserDetailThunk = createAsyncThunk(
  "user/fetch-detail",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(userSlice.actions.setLoading(true));
    return await fetchUserDetail(id);
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUser: state => {
      state.user = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserDetailThunk.fulfilled, (state, action) => {
        state.user = { ...action.payload };
        state.isLoading = false;
      })
      .addCase(fetchUserDetailThunk.pending, (state, action) => {
        state.isLoading = true;
      });
  },
});

export const { setLoading, clearUser } = userSlice.actions;

export default userSlice.reducer;
