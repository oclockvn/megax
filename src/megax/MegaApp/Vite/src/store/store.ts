import { configureStore } from "@reduxjs/toolkit";
import signinSlice from "./signin.slice";

const store = configureStore({
  reducer: {
    signinSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
