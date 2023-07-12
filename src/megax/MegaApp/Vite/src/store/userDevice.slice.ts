import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assignDevice } from "../lib/apis/user.api";

export interface UserDeviceState {
  deviceLoading?: boolean;
  deviceLoadingState?: string;
  deviceError?: string;
}

const initialState: UserDeviceState = {
  deviceLoading: false,
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
      state.deviceLoading = loading;
      state.deviceLoadingState = msg || "Loading";
    },
    clearDeviceError: state => {
      state.deviceError = undefined;
    },
    reset: state => initialState,
  },
  extraReducers(builder) {
    builder.addCase(assignDeviceThunk.fulfilled, (state, action) => {
      state.deviceLoading = false;
      state.deviceLoadingState = undefined;
      state.deviceError = action.payload.success
        ? undefined
        : `Could't assign device. Error code ${action.payload.code}`;
    });
  },
});

export const { reset, clearDeviceError } = userDeviceSlice.actions;
export default userDeviceSlice.reducer;
