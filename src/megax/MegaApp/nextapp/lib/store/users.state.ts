import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import {
  fetchUserDetail,
  fetchUserList,
  updateUserDetail,
  creteUpdateContact,
  deleteContact,
} from "../apis/user.api";
import {
  EmptyPaged,
  Filter,
  PagedResult,
  Result,
} from "../models/common.model";
import { Contact } from "../models/contact.model";

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
  "users/fetch-detail",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Loading..." })
    );
    return await fetchUserDetail(id);
  }
);

export const updateUserDetailThunk = createAsyncThunk(
  "users/update",
  async (user: User, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Saving changes..." })
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

export const createUpdateContactThunk = createAsyncThunk(
  "users/create-update-contact",
  async (req: { id: number; contact: Partial<Contact | null> }, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Saving changes..." })
    );
    try {
      const result = await creteUpdateContact(req.id, req.contact);
      if (result.success) {
        thunkApi.dispatch(userSlice.actions.updateContacts(result.data));
      }

      return result;
    } catch {
      return Promise.resolve<Result<Contact | null>>({
        code: "Failed",
        data: null,
        success: false,
      });
    }
  }
);

export const deleteContactThunk = createAsyncThunk(
  "users/delete-contact",
  async (req: { id: number; contactId: number }, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Deleting..." })
    );
    try {
      const result = await deleteContact(req.id, req.contactId);
      if (result.success) {
        thunkApi.dispatch(userSlice.actions.deleteContacts(req.contactId));
      }

      return result;
    } catch {
      return Promise.resolve<Result<boolean>>({
        code: "Failed",
        data: false,
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
    reset: _ => initialState,
    updateContacts: (state, action: PayloadAction<Contact>) => {
      if (!state.user) {
        return;
      }

      const { payload: contact } = action;
      const updating = state.user.contacts?.some(c => c.id === contact.id);
      if (updating) {
        state.user.contacts =
          state.user.contacts?.map(c =>
            c.id === contact.id
              ? { ...c, ...contact }
              : {
                  ...c,
                  isPrimaryContact: contact.isPrimaryContact
                    ? false
                    : c.isPrimaryContact,
                }
          ) || [];
      } else {
        state.user.contacts = [contact, ...(state.user.contacts || [])];
      }
    },
    deleteContacts: (state, action: PayloadAction<number>) => {
      if (!state.user) {
        return;
      }

      const { payload: contactId } = action;
      state.user.contacts = (state.user.contacts || []).filter(
        c => c.id !== contactId
      );
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
          state.error = `Couldn't update user. Error code: ${action.payload.code}`;
        }
      })
      .addCase(updateUserDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = "Something went wrong!";
      });
  },
});

export const { setLoading, clearUser, clearError, reset } = userSlice.actions;

export default userSlice.reducer;
