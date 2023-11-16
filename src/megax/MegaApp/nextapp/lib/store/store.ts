import { configureStore } from "@reduxjs/toolkit";
import weatherStore from "./weather.state";
import usersStore from "./users.state";
import taskStore from "./tasks.state";
import projectStore from "./projects.state";
import leaveStore from "./leave.state";
import timesheetState from "./timesheet.state";

export const store = configureStore({
  reducer: {
    weather: weatherStore,
    users: usersStore,
    tasks: taskStore,
    projects: projectStore,
    leaves: leaveStore,
    timesheet: timesheetState,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
