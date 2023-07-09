import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";
import { Supplier } from "../models/supplier.model";
import { fetchSupplierList } from "../apis/suppliers.api";

export interface SuppliersState {
  pagedSuppliers: PagedResult<Supplier>;
  loading: boolean;
  loadingState?: string;
  error?: string;
}

const initialState: SuppliersState = {
  pagedSuppliers: EmptyPaged<Supplier>(),
  loading: false,
};

export const fetchSuppliersThunk = createAsyncThunk(
  "suppliers/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(suppliersSlice.actions.setLoadingState("Loading..."));
    return await fetchSupplierList(filter);
  }
);

export const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<string>) => {
      state.loadingState = action.payload;
      state.loading = true;
    },
    clearError: state => {
      state.error = undefined;
    },
    reset: state => ({
      ...initialState,
      currentSupplier: undefined,
    }),
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSuppliersThunk.fulfilled, (state, action) => {
        state.pagedSuppliers = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuppliersThunk.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const { setLoading, reset, clearError, setLoadingState } =
  suppliersSlice.actions;

export default suppliersSlice.reducer;
