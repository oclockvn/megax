import { configureStore } from "@reduxjs/toolkit";
import taskStore from "./tasks.state";
import projectStore from "./projects.state";
import timesheetState from "./timesheet.state";

export const store = configureStore({
  reducer: {
    tasks: taskStore,
    projects: projectStore,
    timesheet: timesheetState,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
