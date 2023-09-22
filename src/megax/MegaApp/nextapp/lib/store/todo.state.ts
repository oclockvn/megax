import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import { Todo } from "../models/todo.model";
import { fetchTodos } from "../apis/todo.api";
// import { fetchTodo } from "../apis/s.api";

export interface TodoState {
  todos: Todo[]
  loading: boolean;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
};

export const fetchTodoThunk = createAsyncThunk(
  "todo/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(sSlice.actions.setLoadingState("Loading..."));
    return await fetchTodos(filter);
  }
);

export const sSlice = createSlice({
  name: "todos",
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
      .addCase(fetchTodoThunk.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodoThunk.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const { setLoading, setLoadingState } = sSlice.actions;

export default sSlice.reducer;
