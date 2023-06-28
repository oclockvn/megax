import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Forecast } from "../lib/models/home.model";
import { fetchWeatherForecast } from "../lib/apis/home.api";

export interface HomeState {
    items: Forecast[];
}

export const getWeatherForecastThunk = createAsyncThunk(
    "home/weatherforecast",
    async () => {
        return await fetchWeatherForecast();
    }
);

const homeState: HomeState = {
    items: [],
};

export const homeSlice = createSlice({
    name: "forecast",
    initialState: homeState,
    reducers: {
        // increment: (state, action: PayloadAction<number>) => {},
    },
    extraReducers: builder =>
        builder.addCase(
            getWeatherForecastThunk.fulfilled,
            (state: HomeState, action: PayloadAction<Forecast[]>) => {
                const { payload: items } = action;

                state.items = items;
            }
        ),
});

export default homeSlice.reducer;
