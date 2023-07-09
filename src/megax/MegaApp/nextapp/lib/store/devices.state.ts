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
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoadingState("Loading..."));
    return await fetchDeviceList(filter);
  }
);

export const fetchDeviceDetailThunk = createAsyncThunk(
  "devices/fetch-detail",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoadingState("Loading..."));
    return await fetchDeviceDetail(id);
  }
);

export const updateDeviceDetailThunk = createAsyncThunk(
  "devices/update-detail",
  async (req: Device, thunkApi) => {
    thunkApi.dispatch(
      devicesSlice.actions.setLoadingState("Saving changes...")
    );

    try {
      return await updateDevice(req);
    } catch {
      return Promise.resolve({
        code: "SOMETHING_WENT_WRONG",
        // data: null,
        success: false,
      } as Result<Device>);
    }
  }
);

export const addDeviceThunk = createAsyncThunk(
  "devices/add-device",
  async (req: Omit<Device, "id">, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoadingState("Processing..."));
    return await addDevice(req);
  }
);

export const deleteDeviceThunk = createAsyncThunk(
  "devices/delete-device",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(devicesSlice.actions.setLoadingState("Processing..."));
    return await deleteDevice(id);
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
    setLoadingState: (state, action: PayloadAction<string>) => {
      state.loadingState = action.payload;
      state.loading = true;
    },
    clearError: state => {
      state.error = undefined;
    },
    reset: state => ({
      ...initialState,
      currentDevice: undefined,
      deviceTypes: state.deviceTypes,
    }),
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
