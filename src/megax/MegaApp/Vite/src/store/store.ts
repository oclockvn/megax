import { configureStore } from "@reduxjs/toolkit";
import signinSlice from "./signin.slice";
import homeSlice from "./home.slice";

const store = configureStore({
  reducer: {
    signinSlice,
    homeSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
