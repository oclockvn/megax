import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserDetail,
  fetchUserList,
  updateUserDetail,
} from "../lib/apis/user.api";
import {
  EmptyPaged,
  Filter,
  PagedResult,
  Result,
} from "../lib/models/common.model";
import { User } from "../lib/models/user.model";

export interface UsersState {
  pagedUsers: PagedResult<User>;
  user?: User;
  loading: boolean;
  loadingState?: string;
  error?: string;
}

const initialState: UsersState = {
  pagedUsers: EmptyPaged<User>(),
  loading: false,
};

export const fetchUsersThunk = createAsyncThunk(
  "users/fetch",
  async (filter: Partial<Filter>, thunkApi) => {
    thunkApi.dispatch(userSlice.actions.setLoading({ loading: true }));
    return await fetchUserList(filter);
  }
);

export const fetchUserDetailThunk = createAsyncThunk(
  "users/user-detail",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Loading..." })
    );
    return await fetchUserDetail(id);
  }
);

export const updateUserDetailThunk = createAsyncThunk(
  "users/update-user",
  async (user: User, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Saving change..." })
    );
    try {
      return await updateUserDetail(user);
    } catch {
      return Promise.resolve<Result<User>>({
        code: "Failed",
        data: user,
        success: false,
      });
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ loading: boolean; msg?: string }>
    ) => {
      const { loading, msg } = action.payload;
      state.loading = loading;
      state.loadingState = msg || "Loading";
    },
    clearUser: state => {
      state.user = undefined;
    },
    clearError: state => {
      state.error = undefined;
    },

    reset: state => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.pagedUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsersThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchUserDetailThunk.fulfilled, (state, action) => {
        state.user = { ...action.payload };
        state.loading = false;
      })
      .addCase(fetchUserDetailThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUserDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { ...action.payload.data };
        } else {
          state.error = `Couldn't update user. Error code: ${action.payload.code} `;
        }
      })
      .addCase(updateUserDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = "Something went wrong";
      });
  },
});

export const { setLoading, clearError, clearUser, reset } = userSlice.actions;
export default userSlice.reducer;
