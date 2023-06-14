import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Forecast } from "../lib/models/home.model";
import { fetchUsersInfo } from '../lib/apis/users.api'

import { UsersInfo } from "../lib/models/users.model";

export interface UsersState {
    items: UsersInfo[];
}

export const getUsersInfoThunk = createAsyncThunk(
    "usersPage/UsersInfo",
    async () => {
        return await fetchUsersInfo();
    }
);

const usersState: UsersState = {
    items: [],
};

export const usersSlice = createSlice({
    name: "usersInfo",
    initialState: usersState,
    reducers: {

    },
    extraReducers: builder =>
        builder.addCase(
            getUsersInfoThunk.fulfilled,
            (state: UsersState, action: PayloadAction<UsersInfo[]>) => {
                const { payload: items } = action;
                state.items = items;
            }
        ),
});
export default usersSlice.reducer;
