import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchDeviceDetail,
  fetchDeviceList,
  getDeviceTypes,
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
// export const updateUserDetailThunk = createAsyncThunk(
//   "user/update-user",
//   async (user: User, thunkApi) => {
//     thunkApi.dispatch(
//       deviceSlice.actions.setLoading({ loading: true, msg: "Saving change..." })
//     );
//     try {
//       return await updateUserDetail(user);
//     } catch {
//       return Promise.resolve<Result<User>>({
//         code: "Failed",
//         data: user,
//         success: false,
//       });
//     }
//   }
// );

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
      });
    // .addCase(updateUserDetailThunk.fulfilled, (state, action) => {
    //   state.loading = false;
    //   if (action.payload.success) {
    //     state.user = { ...action.payload.data };
    //   } else {
    //     state.error = `Couldn't update user. Error code: ${action.payload.code} `;
    //   }
    // })
    // .addCase(updateUserDetailThunk.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = "Something went wrong";
    // });
  },
});

export const { setLoading, clearError, clearDevice, reset } =
  deviceSlice.actions;
export default deviceSlice.reducer;
