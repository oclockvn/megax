import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WorkDay, WorkStatus } from "../models/timesheet.model";
import { getUserTimesheet } from "../apis/user.api";
import dt from "@/lib/datetime";

export interface UserTimesheetState {
  loading: boolean;
  current: Date;
  timesheet: WorkDay[];
}

const initialState: UserTimesheetState = {
  loading: false,
  current: new Date(),
  timesheet: [],
};

export const fetchTimesheetThunk = createAsyncThunk(
  "user-timesheet/fetch",
  async (date: Date, thunkApi) => {
    console.log("fetching timesheet");
    thunkApi.dispatch(setLoading({ loading: true }));
    return await getUserTimesheet(date);
  }
);

export const userTimesheetSlice = createSlice({
  name: "userTimesheet",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ loading: boolean; msg?: string }>
    ) => {
      const { loading, msg } = action.payload;
      state.loading = loading;
    },
    reset: state => initialState,
    navWeek: (state, action: PayloadAction<-1 | 0 | 1>) => {
      switch (action.payload) {
        case 0:
          state.current = new Date();
          break;
        case -1:
          state.current = dt.addDays(state.current, -7);
          break;
        case 1:
          state.current = dt.addDays(state.current, 7);
          break;
      }
    },
    updateWeekStatus: (
      state,
      action: PayloadAction<{ date: Date; status: WorkStatus }>
    ) => {
      state.loading = false;
      const { date, status } = action.payload;
      const found = state.timesheet.find(t => dt.isSameDay(t.date, date))
      if (found) {
        found.status = status;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchTimesheetThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.timesheet = action.payload;
    });
  },
});

export const { setLoading, reset, updateWeekStatus, navWeek } =
  userTimesheetSlice.actions;

export default userTimesheetSlice.reducer;
