import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import { Leave, LeaveRequest, LeaveStatus } from "../models/leave.model";
import { fetchLeaves, submitLeave } from "../apis/leave.api";
// import { fetchTodo } from "../apis/s.api";

export interface LeaveState {
  items: Leave[];
  loading: boolean;
}

const initialState: LeaveState = {
  items: [],
  loading: false,
};

export const fetchLeavesThunk = createAsyncThunk(
  "leaves/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(leaveSlice.actions.setLoadingState("Loading..."));
    return await fetchLeaves();
  }
);

export const submitLeaveThunk = createAsyncThunk(
  "leaves/submit",
  async (request: Partial<LeaveRequest>, _thunkApi) => {
    return await submitLeave(request);
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
    // toggleEditSubLeave: (state, action: PayloadAction<EditSubLeaveType>) => {
    //   const task = state.items.find(t => t.id === action.payload.taskId);
    //   if (!task || !task.subLeaves) {
    //     throw new Error("500");
    //   }

    //   const { id } = action.payload;
    //   task.subLeaves = task.subLeaves.map(t => ({
    //     ...t,
    //     isEdit: t.id === id ? !t.isEdit : false,
    //   }));
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLeavesThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeavesThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(submitLeaveThunk.fulfilled, (state, action) => {
        const leave = action.payload.data;
        state.items.unshift(leave);
      });
  },
});

export const { setLoading, setLoadingState } = leaveSlice.actions;

export default leaveSlice.reducer;
