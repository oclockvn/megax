import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Leave,
  LeaveAction,
  LeaveActionRequest,
  LeaveDate,
  LeaveRequest,
  LeaveStatus,
} from "../models/leave.model";
import {
  approveLeave,
  handleAction,
  submitLeave,
} from "../apis/leave.api";
// import { fetchTodo } from "../apis/s.api";

export interface LeaveState {
  items: Leave[];
  requesting: Leave[];
  approvedDates: LeaveDate[];
  capacity: number;
  loading: boolean;
  error?: string;
}

const initialState: LeaveState = {
  items: [],
  requesting: [],
  approvedDates: [],
  capacity: 0,
  loading: false,
};

export const submitLeaveThunk = createAsyncThunk(
  "leaves/submit",
  async (request: Partial<LeaveRequest>, _thunkApi) => {
    return await submitLeave(request);
  }
);

export const approveLeaveThunk = createAsyncThunk(
  "leaves/approve",
  async (id: number, _thunkApi) => {
    return await approveLeave(id);
  }
);

export const handleLeaveActionThunk = createAsyncThunk(
  "leaves/handle-action",
  async (
    { id, request }: { id: number; request: LeaveActionRequest },
    _thunkApi
  ) => {
    return await handleAction(id, request);
  }
);

export const leaveSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(submitLeaveThunk.fulfilled, (state, action) => {
        const { data, success, code } = action.payload;
        if (success) {
          state.items.unshift(data);
          // state.error = undefined;
        } else {
          // state.error = `Request failed. Error code: ${code}`;
        }
      })
      .addCase(handleLeaveActionThunk.fulfilled, (state, action) => {
        if (!action.payload.success) {
          return;
        }

        const {
          request: { action: actionType, comment },
          id,
        } = action.meta.arg;
        const result = action.payload.data;
        const leave = state.items.find(x => x.id === id);
        if (leave) {
          leave.status = result;
          leave.comment = comment;
        }

        switch (actionType) {
          case LeaveAction.Approve:
          case LeaveAction.Reject:
            state.requesting = state.requesting.filter(x => x.id !== id);
            break;
          case LeaveAction.Cancel:
            if (result !== LeaveStatus.Cancelled) {
              state.items = state.items.filter(x => x.id !== id);
            }
            break;
        }
      })
      .addCase(approveLeaveThunk.fulfilled, (state, action) => {
        if (action.payload.success) {
          const id = action.meta.arg;
          const leave = state.items.find(x => x.id === id);

          leave!.status = LeaveStatus.Approved;

          state.requesting = state.requesting.filter(x => x.id !== id);
        }
      });
  },
});

export const { setLoading, setLoadingState } = leaveSlice.actions;

export default leaveSlice.reducer;
