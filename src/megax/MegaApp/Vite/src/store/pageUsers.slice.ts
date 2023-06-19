import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPageUser } from "../lib/apis/users.api";
import { UsersInfo } from "../lib/models/users.model";

export interface UsersState {
    items: UsersInfo[];
}

export const getPageUsersThunk = createAsyncThunk(
    "usersPage/pageUser",
    async page => {
        return await fetchPageUser(page);
    }
);

const usersState: UsersState = {
    items: [],
};

export const pageUsersSlice = createSlice({
    name: "pageUsers",
    initialState: usersState,
    reducers: {

    },
    extraReducers: builder =>
        builder.addCase(
            getPageUsersThunk.fulfilled,
            (state: UsersState, action: PayloadAction<UsersInfo[]>) => {
                const { payload: items } = action;
                state.items = items;
            }
        ),
});
export default pageUsersSlice.reducer;
