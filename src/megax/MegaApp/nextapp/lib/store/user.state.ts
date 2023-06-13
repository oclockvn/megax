import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import { fetchUserList } from "../apis/user.api";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";

export interface UserState {
  pagedUsers: PagedResult<User>;
  isLoading: boolean;
}

const initialState: UserState = {
  pagedUsers: EmptyPaged<User>(),
  isLoading: false,
};

export const fetchUsersThunk = createAsyncThunk(
  "user/fetch",
  async (filter: Partial<Filter>, thunkApi) => {
    thunkApi.dispatch(userSlice.actions.setLoading(true));
    return await fetchUserList(filter);
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.pagedUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsersThunk.pending, (state, action) => {
        state.isLoading = true;
      });
  },
});

export const { setLoading } = userSlice.actions;

export default userSlice.reducer;
