import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";
import { Bank } from "../models/bank.model";
import { fetchBanks } from "../apis/banks.api";

export interface BanksState {
  pagedBanks: PagedResult<Bank>;
  loading: boolean;
}

const initialState: BanksState = {
  pagedBanks: EmptyPaged<Bank>(),
  loading: false,
};

export const fetchBanksThunk = createAsyncThunk(
  "banks/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(banksSlice.actions.setLoadingState("Loading..."));
    return await fetchBanks(filter);
  }
);

export const banksSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBanksThunk.fulfilled, (state, action) => {
        state.pagedBanks = action.payload;
        state.loading = false;
      })
      .addCase(fetchBanksThunk.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const { setLoading, setLoadingState } = banksSlice.actions;

export default banksSlice.reducer;
