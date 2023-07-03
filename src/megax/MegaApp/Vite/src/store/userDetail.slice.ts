import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserDetail } from "../lib/apis/user.api";
import { EmptyUser, User } from "../lib/models/user.model";

export interface UsersState {
  user: User;
  isLoading: boolean;
}

const initialState: UsersState = {
  user: EmptyUser(),
  isLoading: false,
};

export const fetchUserDetailThunk = createAsyncThunk(
  "userDetail/fetch",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(userDetail.actions.setLoading(true));
    return await fetchUserDetail(id);
  }
);

export const userDetail = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserDetailThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserDetailThunk.pending, (state, action) => {
        state.isLoading = true;
      });
  },
});

export const { setLoading } = userDetail.actions;
export default userDetail.reducer;
