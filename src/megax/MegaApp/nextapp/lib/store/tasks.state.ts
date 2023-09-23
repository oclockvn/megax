import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import { SubTask, Task } from "../models/task.model";
import {
  addSubTask,
  deleteTask as deleteTask,
  fetchTasks,
} from "../apis/task.api";
// import { fetchTodo } from "../apis/s.api";

export interface TaskState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
};

export const fetchTaskListThunk = createAsyncThunk(
  "tasks/fetch",
  async (filter: Partial<Filter> | undefined, thunkApi) => {
    thunkApi.dispatch(sSlice.actions.setLoadingState("Loading..."));
    return await fetchTasks(filter);
  }
);

export const deleteTaskThunk = createAsyncThunk(
  "tasks/delete",
  async (id: number, _thunkApi) => {
    return await deleteTask(id);
  }
);

export const addSubTaskThunk = createAsyncThunk(
  "tasks/add-subtask",
  async (subtask: SubTask, _thunkApi) => {
    return await addSubTask(subtask);
  }
);

export const sSlice = createSlice({
  name: "tasks",
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
      .addCase(fetchTaskListThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaskListThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(x => x.id !== action.payload.data);
      })
      .addCase(addSubTaskThunk.fulfilled, (state, action) => {
        // state.tasks = state.tasks.filter(x => x.id !== action.payload.data);
        const task = state.tasks.find(t => t.id === action.payload.data.taskId);
        if (task == null) {
          throw new Error(
            `Something went wrong with task ${action.payload.data.taskId}`
          );
        }

        if (!task.subtasks) {
          task.subtasks = [];
        }

        task.subtasks.push(action.payload.data);
      });
  },
});

export const { setLoading, setLoadingState } = sSlice.actions;

export default sSlice.reducer;
