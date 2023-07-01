import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";
import { Device } from "../models/device.model";
import { fetchDeviceList } from "../apis/devices.api";

export interface DevicesState {
  pagedDevices: PagedResult<Device>;
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

export const devicesSlice = createSlice({
  name: "devices",
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
      });
  },
});

export const { setLoading } = devicesSlice.actions;

export default devicesSlice.reducer;
