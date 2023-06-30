import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import { fetchUserList } from "../apis/user.api";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";

export interface UsersState {
  pagedUsers: PagedResult<User>;
  loading: boolean;
}

const initialState: UsersState = {
  pagedUsers: EmptyPaged<User>(),
  loading: false,
};

export const fetchUsersThunk = createAsyncThunk(
  "users/fetch",
  async (filter: Partial<Filter>, thunkApi) => {
    thunkApi.dispatch(userSlice.actions.setLoading(true));
    return await fetchUserList(filter);
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.pagedUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsersThunk.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const { setLoading } = userSlice.actions;

export default userSlice.reducer;
