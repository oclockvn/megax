import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { assignDevice } from "../apis/user.api";

export interface UserDeviceState {
  loading: boolean;
  loadingState?: string;
  error?: string;
}

const initialState: UserDeviceState = {
  loading: false,
};

export const assignDeviceThunk = createAsyncThunk(
  "users/assign-device",
  async (req: { userId: number; deviceId: number }, thunkApi) => {
    return await assignDevice(req.userId, req.deviceId);
  }
);

export const userDeviceSlice = createSlice({
  name: "userDevice",
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
    clearError: state => {
      state.error = undefined;
    },
    reset: state => initialState,
  },
  extraReducers(builder) {
    builder.addCase(assignDeviceThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.loadingState = undefined;
      state.error = action.payload.success
        ? undefined
        : `Couldn't add device. Error code: ${action.payload.code}`;
    });
  },
});

export const { setLoading, clearError, reset } = userDeviceSlice.actions;

export default userDeviceSlice.reducer;
