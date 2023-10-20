import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
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
  cancelLeave,
  fetchLeaveSummary,
  fetchLeaves,
  fetchRequestingLeaves,
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

export const fetchLeavesThunk = createAsyncThunk(
  "leaves/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(leaveSlice.actions.setLoadingState("Loading..."));
    return await fetchLeaves();
  }
);

export const fetchRequestingLeavesThunk = createAsyncThunk(
  "leaves/requesting",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(leaveSlice.actions.setLoadingState("Loading..."));
    return await fetchRequestingLeaves();
  }
);

export const fetchLeaveSummaryThunk = createAsyncThunk(
  "leaves/summary",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(leaveSlice.actions.setLoadingState("Loading..."));
    return await fetchLeaveSummary();
  }
);

export const submitLeaveThunk = createAsyncThunk(
  "leaves/submit",
  async (request: Partial<LeaveRequest>, _thunkApi) => {
    return await submitLeave(request);
  }
);

export const cancelLeaveThunk = createAsyncThunk(
  "leaves/cancel",
  async (id: number, _thunkApi) => {
    return await cancelLeave(id);
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
      .addCase(fetchLeaveSummaryThunk.fulfilled, (state, action) => {
        const { leaves, capacity, approvedDates } = action.payload;
        state.items = leaves;
        state.approvedDates = approvedDates;
        state.capacity = capacity;
        state.loading = false;
      })
      .addCase(fetchLeavesThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRequestingLeavesThunk.fulfilled, (state, action) => {
        state.requesting = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeavesThunk.pending, (state, action) => {
        state.loading = true;
      })
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
      })
      .addCase(cancelLeaveThunk.fulfilled, (state, action) => {
        const { success, data } = action.payload;
        if (!success) {
          return;
        }

        const id = action.meta.arg;
        if (data === LeaveStatus.Cancelled) {
          const leave = state.items.find(x => x.id === id);
          leave!.status = data;
        } else {
          state.items = state.items.filter(x => x.id !== id);
        }
      });
  },
});

export const { setLoading, setLoadingState } = leaveSlice.actions;

export default leaveSlice.reducer;
