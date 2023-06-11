import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchWeatherForecast } from "../apis/weather.api";
import { WeatherForecast } from "../models/weather.model";

export interface WeatherState {
  weatherForecast: WeatherForecast[];
  loading: boolean;
}

const initialState: WeatherState = {
  weatherForecast: [],
  loading: false,
};

export const fetchWeatherForecastThunk = createAsyncThunk(
  "weather/fetch",
  async (payload, thunkApi) => {
    return await fetchWeatherForecast();
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWeatherForecastThunk.fulfilled, (state, action) => {
        state.weatherForecast = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeatherForecastThunk.pending, (state, action) => {
        state.loading = true;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default weatherSlice.reducer;
