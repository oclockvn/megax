import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import { SubTask, SubTaskAction, Task } from "../models/task.model";
import {
  addSubTask,
  deleteTask as deleteTask,
  fetchTasks,
  handleSubTaskAction,
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

export const handleSubTaskThunk = createAsyncThunk(
  "tasks/handle-subtask",
  async (
    payload: { id: number; taskId: number; action: SubTaskAction },
    _thunkApi
  ) => {
    return await handleSubTaskAction(
      payload.id,
      payload.taskId,
      payload.action
    );
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
      })
      .addCase(handleSubTaskThunk.fulfilled, (state, action) => {
        const {
          data: { id, action: subTaskAction, taskId },
        } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);

        if (task == null) {
          throw new Error(
            `Something went wrong with task ${action.payload.data.taskId}`
          );
        }

        const subTask = task.subtasks.find(s => s.id === id);
        if (subTask == null) {
          throw new Error(`Something went wrong with subtask ${id}`);
        }

        switch (subTaskAction) {
          case "complete":
            subTask.isCompleted = !subTask.isCompleted;
            subTask.isFlag = false;
            break;
          case "flag":
            subTask.isFlag = !subTask.isFlag;
            subTask.isCompleted = false;
            break;
          default:
            task.subtasks = task?.subtasks.filter(s => s.id !== id);
            break;
        }
      });
  },
});

export const { setLoading, setLoadingState } = sSlice.actions;

export default sSlice.reducer;
