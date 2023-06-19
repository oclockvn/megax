import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSearchUser } from "../lib/apis/users.api";


import { UsersInfo } from "../lib/models/users.model";

export interface UsersState {
    items: UsersInfo[];
}

export const getSearchUsersThunk = createAsyncThunk(
    "usersPage/searchUser",
    async keyword => {
        return await fetchSearchUser(keyword);
    }
);

const usersState: UsersState = {
    items: [],
};

export const searchUserSlice = createSlice({
    name: "searchUsers",
    initialState: usersState,
    reducers: {

    },
    extraReducers: builder =>
        builder.addCase(
            getSearchUsersThunk.fulfilled,
            (state: UsersState, action: PayloadAction<UsersInfo[]>) => {
                const { payload: items } = action;
                state.items = items;
            }
        ),
});
export default searchUserSlice.reducer;
