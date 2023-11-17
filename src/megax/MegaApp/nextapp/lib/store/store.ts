import { configureStore } from "@reduxjs/toolkit";
import usersStore from "./users.state";
import taskStore from "./tasks.state";
import projectStore from "./projects.state";
import timesheetState from "./timesheet.state";

export const store = configureStore({
  reducer: {
    users: usersStore,
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
