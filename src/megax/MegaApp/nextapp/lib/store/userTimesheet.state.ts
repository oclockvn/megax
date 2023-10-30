import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Timesheet, WorkType } from "../models/timesheet.model";
import { applyTimesheet, getTimesheet } from "../apis/user.api";
import dt from "@/lib/datetime";

export interface UserTimesheetState {
  loading: boolean;
  current: Date;
  timesheet: Timesheet[];
}

const initialState: UserTimesheetState = {
  loading: false,
  current: new Date(),
  timesheet: [],
};

export const fetchTimesheetThunk = createAsyncThunk(
  "user-timesheet/fetch",
  async (date: Date, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await getTimesheet(date);
  }
);

export const applyTimesheetThunk = createAsyncThunk(
  "user-timesheet/apply",
  async (req: { timesheet: Timesheet[] }, thunkApi) => {
    thunkApi.dispatch(setLoading({ loading: true }));
    return await applyTimesheet(
      req.timesheet?.filter(t => !dt.isWeekend(t.date))
    );
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
    reset: _ => initialState,
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
      action: PayloadAction<{ date: Date; status: WorkType }>
    ) => {
      state.loading = false;
      const { date, status } = action.payload;
      const found = state.timesheet.find(t => dt.isSameDay(t.date, date));
      if (found) {
        found.workType = status;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTimesheetThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.timesheet = action.payload;
      })
      .addCase(applyTimesheetThunk.rejected, (state, _) => {
        state.loading = false;
      });
  },
});

export const { setLoading, reset, updateWeekStatus, navWeek } =
  userTimesheetSlice.actions;

export default userTimesheetSlice.reducer;
