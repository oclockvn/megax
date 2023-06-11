import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import { fetchUserList } from "../apis/user.api";

export interface UserState {
  users: User[];
  isLoading: boolean;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
};

export const fetchUsersThunk = createAsyncThunk("user/fetch", async () => {
  return await fetchUserList();
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsersThunk.pending, (state, action) => {
        state.isLoading = true;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default userSlice.reducer;
