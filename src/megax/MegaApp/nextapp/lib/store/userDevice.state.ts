import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { assignDevice, getDevices, returnDevice } from "../apis/user.api";
import { UserDeviceRecord } from "../models/user.model";
import { DeviceOwnerRecord } from "../models/device.model";
import { fetchDeviceOwners } from "../apis/devices.api";

export interface UserDeviceState {
  loading: boolean;
  loadingState?: string;
  error?: string;
  devices: UserDeviceRecord[];
  owners: DeviceOwnerRecord[];
}

const initialState: UserDeviceState = {
  loading: false,
  devices: [],
  owners: [],
};

export const assignDeviceThunk = createAsyncThunk(
  "users/assign-device",
  async (req: { userId: number; deviceId: number }, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await assignDevice(req.userId, req.deviceId);
  }
);

export const returnDeviceThunk = createAsyncThunk(
  "users/return-device",
  async (req: { userId: number; deviceId: number }, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await returnDevice(req.userId, req.deviceId);
  }
);

export const getUserDevicesThunk = createAsyncThunk(
  "users/devices",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await getDevices(id);
  }
);

export const getOwnersThunk = createAsyncThunk(
  "users/owners",
  async (deviceId: number, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await fetchDeviceOwners(deviceId);
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
    builder
      .addCase(assignDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        const { success, data, code } = action.payload;
        state.error = success
          ? undefined
          : `Couldn't add device. Error code: ${code}`;

        if (success) {
          state.devices = [data, ...state.devices];
        }
      })
      .addCase(getUserDevicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload || [];
      })
      .addCase(returnDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { success, data, code } = action.payload;
        state.error = success
          ? undefined
          : `Coundn't return device. Error code: ${code}`;

        if (data) {
          const deviceId = action.meta.arg.deviceId;
          const device = state.devices.find(d => d.id === deviceId);

          if (device) {
            device.returnedAt = new Date();
          } else {
            throw new Error("something went wrong");
          }
        }
      })
      .addCase(getOwnersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.owners = action.payload || [];
      });
  },
});

export const { setLoading, clearError, reset } = userDeviceSlice.actions;

export default userDeviceSlice.reducer;
