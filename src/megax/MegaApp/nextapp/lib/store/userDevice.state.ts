import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { assignDevice, getDevices, returnDevice } from "../apis/user.api";
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
    // addDevice: (state, action: PayloadAction<UserDeviceModel>) => {
    //   const { deviceId } = action.payload;
    //   const exist = state.devices.find(d => d.deviceId === deviceId);
    //   if (exist) {
    //     exist.qty += 1;
    //   } else {
    //     state.devices = [action.payload, ...state.devices];
    //   }
    // },
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
          const exist = state.devices.find(d => d.deviceId === data.deviceId);
          if (exist) {
            exist.qty += 1;
          } else {
            state.devices = [data, ...state.devices];
          }
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
          const device = state.devices.find(
            d => d.deviceId === action.meta.arg.deviceId
          );

          if (device) {
            device.qty -= 1;
          } else {
            throw new Error("something went wrong");
          }
        }
      });
  },
});

export const { setLoading, clearError, reset } = userDeviceSlice.actions;

export default userDeviceSlice.reducer;
