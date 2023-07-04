import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { assignDevice, getDevices } from "../apis/user.api";
import { UserDeviceModel } from "../models/user.model";

export interface UserDeviceState {
  loading: boolean;
  loadingState?: string;
  error?: string;
  devices: UserDeviceModel[];
}

const initialState: UserDeviceState = {
  loading: false,
  devices: [],
};

export const assignDeviceThunk = createAsyncThunk(
  "users/assign-device",
  async (req: { userId: number; deviceId: number }, thunkApi) => {
    return await assignDevice(req.userId, req.deviceId);
  }
);

export const getUserDevicesThunk = createAsyncThunk(
  "users/devices",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await getDevices(id);
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
    addDevice: (state, action: PayloadAction<UserDeviceModel>) => {
      const {
        payload: { deviceId },
      } = action;
      const exist = state.devices.find(d => d.deviceId === deviceId);
      if (exist) {
        state.devices = state.devices.map(d =>
          d.deviceId === deviceId ? { ...d, qty: d.qty + 1 } : d
        );
      } else {
        state.devices = [action.payload, ...state.devices];
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(assignDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = action.payload.success
          ? undefined
          : `Couldn't add device. Error code: ${action.payload.code}`;
      })
      .addCase(getUserDevicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload || [];
      });
  },
});

export const { setLoading, clearError, reset, addDevice } =
  userDeviceSlice.actions;

export default userDeviceSlice.reducer;
