import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  EmptyPaged,
  Filter,
  PagedResult,
  Result,
} from "../models/common.model";
import { Device, DeviceType } from "../models/device.model";
import {
  addDevice,
  deleteDevice,
  fetchDeviceDetail,
  fetchDeviceList,
  getDeviceTypes,
  updateDevice,
} from "../apis/devices.api";

export interface AuthState {
  loading: boolean;
  error?: string;
}

const initialState: AuthState = {
  loading: false,
};

export const googleSignInThunk = createAsyncThunk(
  "auth/google-sign-in",
  async (idToken: string, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoadingState("Loading..."));
    return await fetchDeviceList(filter);
  }
);


export const devicesSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDevicesThunk.fulfilled, (state, action) => {
        state.pagedDevices = action.payload;
        state.loading = false;
      })
      .addCase(fetchDevicesThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchDeviceDetailThunk.fulfilled, (state, action) => {
        state.currentDevice = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeviceDetailThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateDeviceDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.currentDevice = { ...action.payload.data };
          state.error = undefined;
        } else {
          state.error = `Couldn't update device. Error code: ${action.payload.code}`;
        }
      })
      .addCase(updateDeviceDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = `Something went wrong`;
      })
      .addCase(fetchDeviceTypesThunk.fulfilled, (state, action) => {
        state.deviceTypes = action.payload;
      })
      .addCase(addDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        if (action.payload.success) {
          state.currentDevice = action.payload.data;
        } else {
          state.error = `Couldn't add device. Error code: ${action.payload.code}`;
        }
      })
      .addCase(addDeviceThunk.rejected, state => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = `Something went wrong`;
      })
      .addCase(deleteDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = action.payload.success
          ? undefined
          : `Couldn't delete device. Error code: ${action.payload.code}`;
      })
      .addCase(deleteDeviceThunk.rejected, (state, _) => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = `Something went wrong`;
      });
  },
});

export const { setLoading, reset, clearError, setLoadingState } =
  devicesSlice.actions;

export default devicesSlice.reducer;
