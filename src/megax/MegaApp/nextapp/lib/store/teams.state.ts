import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TeamQueryInclude, Team } from "../models/team.model";
import { createTeam, getTeam, getTeams, updateTeam } from "../apis/team.api";

export interface TeamState {
  teams: Team[];
  current?: Team;
  loading: boolean;
  error?: string;
}

const initialState: TeamState = {
  teams: [],
  loading: false,
};

export const fetchTeamsThunk = createAsyncThunk(
  "teams/fetch",
  async (args: { include?: TeamQueryInclude }, thunkApi) => {
    thunkApi.dispatch(teamSlice.actions.setLoading({ loading: true }));
    return await getTeams(args?.include);
  }
);

export const fetchTeamThunk = createAsyncThunk(
  "teams/fetch-by-id",
  async (id: number, thunkApi) => {
    thunkApi.dispatch(teamSlice.actions.setLoading({ loading: true }));
    return await getTeam(id);
  }
);

export const createTeamThunk = createAsyncThunk(
  "teams/create",
  async (req: Team, thunkApi) => {
    thunkApi.dispatch(teamSlice.actions.setLoading({ loading: true }));
    return await createTeam(req);
  }
);

export const updateTeamThunk = createAsyncThunk(
  "teams/update",
  async (team: Team, thunkApi) => {
    thunkApi.dispatch(teamSlice.actions.setLoading({ loading: true }));
    return await updateTeam(team);
  }
);

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ loading: boolean; msg?: string }>
    ) => {
      const { loading, msg } = action.payload;
      state.loading = loading;
    },
    clearError: state => {
      state.error = undefined;
    },
    reset: _ => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTeamsThunk.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamThunk.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(createTeamThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { success, data, code } = action.payload;
        if (success) {
          state.current = data;
        } else {
          state.error = `Could not create team. Error code: ${code}`;
        }
      })
      .addCase(createTeamThunk.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTeamThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { success, data } = action.payload;
        if (success) {
          state.current = data;
        }
      })
      .addCase(updateTeamThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setLoading, clearError, reset } = teamSlice.actions;

export default teamSlice.reducer;
