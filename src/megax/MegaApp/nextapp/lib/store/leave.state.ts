import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import { Leave, LeaveDate, LeaveRequest, LeaveStatus } from "../models/leave.model";
import { cancelLeave, fetchLeaveSummary, fetchLeaves, submitLeave } from "../apis/leave.api";
// import { fetchTodo } from "../apis/s.api";

export interface LeaveState {
  items: Leave[];
  approvedDates: LeaveDate[];
  capacity: number;
  loading: boolean;
  error?: string;
}

const initialState: LeaveState = {
  items: [],
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
      .addCase(cancelLeaveThunk.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.items = state.items.filter(x => x.id !== action.payload.data);
        }
      });
  },
});

export const { setLoading, setLoadingState } = leaveSlice.actions;

export default leaveSlice.reducer;
