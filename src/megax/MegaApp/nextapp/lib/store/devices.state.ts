import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";
import { Device, DeviceType } from "../models/device.model";
import {
  fetchDeviceDetail,
  fetchDeviceList,
  getDeviceTypes,
  updateDevice,
} from "../apis/devices.api";

export interface DevicesState {
  pagedDevices: PagedResult<Device>;
  currentDevice?: Device;
  loading: boolean;
  loadingState?: string;
  error?: string;
  deviceTypes: DeviceType[];
}

const initialState: DevicesState = {
  pagedDevices: EmptyPaged<Device>(),
  deviceTypes: [],
  loading: false,
};

export const fetchDevicesThunk = createAsyncThunk(
  "devices/fetch",
  async (filter: Partial<Filter>, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoading(true));
    return await fetchDeviceList(filter);
  }
);

export const fetchDeviceDetailThunk = createAsyncThunk(
  "devices/fetch-detail",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoading(true));
    return await fetchDeviceDetail(id);
  }
);

export const updateDeviceDetailThunk = createAsyncThunk(
  "devices/update-detail",
  async (req: Device, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoading(true));
    return await updateDevice(req);
  }
);

export const fetchDeviceTypesThunk = createAsyncThunk(
  "devices/fetch-device-types",
  async () => {
    return await getDeviceTypes();
  }
);

export const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: state => {
      state.error = undefined;
    },
    reset: state => initialState,
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
      });
  },
});

export const { setLoading, reset, clearError } = devicesSlice.actions;

export default devicesSlice.reducer;
