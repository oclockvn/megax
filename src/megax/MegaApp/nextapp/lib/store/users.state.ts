import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user.model";
import {
  updateUserDetail,
  creteUpdateDocument,
  deleteDocument,
} from "../apis/user.api";
import {
  EmptyPaged,
  PagedResult,
  Result,
} from "../models/common.model";
import { Document as UserDocument } from "../models/document.model";
import { updateUserRoles } from "../apis/userRole.api";

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

export const createUpdateDocumentThunk = createAsyncThunk(
  "users/create-update-document",
  async (
    req: { id: number; document: Partial<UserDocument | null>; files?: File[] },
    thunkApi
  ) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Saving changes..." })
    );
    try {
      const result = await creteUpdateDocument(req.id, req.document, req.files);
      if (result.success) {
        thunkApi.dispatch(userSlice.actions.updateDocuments(result.data));
      }

      return result;
    } catch {
      thunkApi.dispatch(userSlice.actions.setLoading({ loading: false }));
      return Promise.resolve<Result<UserDocument | null>>({
        code: "Failed",
        data: null,
        success: false,
      });
    }
  }
);

export const deleteDocumentThunk = createAsyncThunk(
  "users/delete-document",
  async (req: { id: number; documentId: number }, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Deleting..." })
    );
    try {
      const result = await deleteDocument(req.id, req.documentId);
      if (result.success) {
        thunkApi.dispatch(userSlice.actions.deleteDocument(req.documentId));
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

export const updateUserRolesThunk = createAsyncThunk(
  "users/update-roles",
  async (req: { id: number; roles: number[] }, thunkApi) => {
    thunkApi.dispatch(
      userSlice.actions.setLoading({ loading: true, msg: "Saving changes..." })
    );

    return await updateUserRoles(req.id, req.roles);
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
    updateDocuments: (state, action: PayloadAction<UserDocument>) => {
      if (!state.user) {
        return;
      }

      const { payload: document } = action;
      const updating = state.user.documents?.some(c => c.id === document.id);
      if (updating) {
        state.user.documents =
          state.user.documents?.map(c =>
            c.id === document.id ? { ...c, ...document } : c
          ) || [];
      } else {
        state.user.documents = [document, ...(state.user.documents || [])];
      }
    },
    deleteDocument: (state, action: PayloadAction<number>) => {
      if (!state.user) {
        return;
      }

      const { payload: documentId } = action;
      state.user.documents = (state.user.documents || []).filter(
        c => c.id !== documentId
      );
    },
  },
  extraReducers(builder) {
    builder
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
      })
      .addCase(updateUserRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user!.roles = action.payload.data.map(r => ({
            roleId: r,
            role: "",
          }));
        }
      });
  },
});

export const { setLoading, clearUser, clearError, reset } = userSlice.actions;

export default userSlice.reducer;
