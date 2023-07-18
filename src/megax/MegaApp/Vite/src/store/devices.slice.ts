import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addDevice,
  deleteDevice,
  fetchDeviceDetail,
  fetchDeviceList,
  getDeviceTypes,
  updateDeviceDetail,
} from "../lib/apis/device.api";
import {
  EmptyPaged,
  Filter,
  PagedResult,
  Result,
} from "../lib/models/common.model";
import { Device, DeviceType } from "../lib/models/device.model";

export interface DeviceState {
  pagedDevices: PagedResult<Device>;
  device?: Device;
  loading: boolean;
  loadingState?: string;
  error?: string;
  deviceTypes: DeviceType[];
}

const initialState: DeviceState = {
  pagedDevices: EmptyPaged<Device>(),
  deviceTypes: [],
  loading: false,
};

export const fetchDevicesThunk = createAsyncThunk(
  "devices/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(deviceSlice.actions.setLoading({ loading: true }));
    return await fetchDeviceList(filter);
  }
);

export const fetchDeviceDetailThunk = createAsyncThunk(
  "devices/device-detail",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(
      deviceSlice.actions.setLoading({ loading: true, msg: "Loading..." })
    );
    return await fetchDeviceDetail(id);
  }
);

export const fetchDeviceTypesThunk = createAsyncThunk(
  "devices/device-types",
  async () => {
    return await getDeviceTypes();
  }
);


export const updateDeviceDetailThunk = createAsyncThunk(
  "devices/update-detail",
  async (req: Device, thunkApi) => {
    thunkApi.dispatch(deviceSlice.actions.setLoadingState("Saving changes..."));

    try {
      return await updateDeviceDetail(req);
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
  async (device: Omit<Device, "id">, thunkApi) => {
    thunkApi.dispatch(deviceSlice.actions.setLoadingState("Processing..."));
    return await addDevice(device);
  }
);

export const deleteDeviceThunk = createAsyncThunk(
  "devices/delete-device",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(deviceSlice.actions.setLoadingState("Processing..."));
    return await deleteDevice(id);
  }
);
export const deviceSlice = createSlice({
  name: "devices",
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
    setLoadingState: (state, action: PayloadAction<string>) => {
      state.loadingState = action.payload;
      state.loading = true;
    },
    clearDevice: state => {
      state.device = undefined;
    },
    clearError: state => {
      state.error = undefined;
    },
    reset: state => ({
      ...initialState,
      device: undefined,
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
        state.device = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeviceDetailThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchDeviceTypesThunk.fulfilled, (state, action) => {
        state.deviceTypes = action.payload;
      })
      .addCase(updateDeviceDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.device = { ...action.payload.data };
          state.error = undefined;
        } else {
          state.error = `Couldn't update device. Error code : ${action.payload.code}`;
        }
      })
      .addCase(updateDeviceDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = "Something went wrong";
      })
      .addCase(deleteDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = action.payload.success
          ? undefined
          : `Counld't delete device. Error code: ${action.payload.code} `;
      })
      .addCase(deleteDeviceThunk.rejected, (state, _) => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = `Something went wrong`;
      })

      .addCase(addDeviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        if (action.payload.success) {
          state.device = action.payload.data;
        } else {
          state.error = `Cound't add device. Error code : ${action.payload.code}`;
        }
      })
      .addCase(addDeviceThunk.rejected, (state, action) => {
        state.loading = false;
        state.loadingState = undefined;
        state.error = "Something went wrong";
      });
  },
});

export const { setLoading, clearError, clearDevice, reset, setLoadingState } =
  deviceSlice.actions;
export default deviceSlice.reducer;
