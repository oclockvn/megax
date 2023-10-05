import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmptyPaged, Filter, PagedResult } from "../models/common.model";
import { Project } from "../models/project.model";
import { fetchProjects } from "../apis/projects.api";

export interface projectsState {
  pagedProjects: PagedResult<Project>;
  loading: boolean;
}

const initialState: projectsState = {
  pagedProjects: EmptyPaged<Project>(),
  loading: false,
};

export const fetchProjectsThunk = createAsyncThunk(
  "projects/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(projectsSlice.actions.setLoadingState("Loading..."));
    return await fetchProjects(filter);
  }
);

export const projectsSlice = createSlice({
  name: "projects",
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
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.pagedProjects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjectsThunk.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const { setLoading, setLoadingState } = projectsSlice.actions;

export default projectsSlice.reducer;
