import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";
import { Device } from "../models/device.model";
import { fetchDeviceDetail, fetchDeviceList } from "../apis/devices.api";

export interface DevicesState {
  pagedDevices: PagedResult<Device>;
  currentDevice?: Device;
  loading: boolean;
}

const initialState: DevicesState = {
  pagedDevices: EmptyPaged<Device>(),
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

export const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
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
      });
  },
});

export const { setLoading, reset } = devicesSlice.actions;

export default devicesSlice.reducer;
