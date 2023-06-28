import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserList } from "../lib/apis/user.api";
import { EmptyPaged, Filter, PagedResult } from "../lib/models/common.model";
import { User } from "../lib/models/user.model";

export interface UsersState {
    pagedUsers: PagedResult<User>;
    isLoading: boolean;
}

const initialState: UsersState = {
    pagedUsers: EmptyPaged<User>(),
    isLoading: false,
}

export const fetchUsersThunk = createAsyncThunk(
    'users/fetch',
    async (filter: Partial<Filter>, thunkApi) => {
        thunkApi.dispatch(userSlice.actions.setLoading(true))
        return await fetchUserList(filter)
    }
)

export const userSlice = createSlice({
    name: 'users',
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
            })
    }
});

export const { setLoading } = userSlice.actions
export default userSlice.reducer
