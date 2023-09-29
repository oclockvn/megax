import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import { SubTask, SubTaskAction, Task, TaskAdd } from "../models/task.model";
import {
  saveSubTask,
  deleteTask as deleteTask,
  fetchTasks,
  handleSubTaskAction,
  addTask,
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

export const saveSubTaskThunk = createAsyncThunk(
  "tasks/save-subtask",
  async (subtask: SubTask, _thunkApi) => {
    return await saveSubTask(subtask);
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

export const addTaskThunk = createAsyncThunk(
  "tasks/add-task",
  async (task: TaskAdd, _thunkApi) => {
    return await addTask(task);
  }
);

export type EditSubTaskType = { id: number; taskId: number };

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
    toggleEditSubTask: (state, action: PayloadAction<EditSubTaskType>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (!task || !task.subtasks) {
        throw new Error("500");
      }

      const { id } = action.payload;
      task.subtasks = task.subtasks.map(t => ({
        ...t,
        isEdit: t.id === id ? !t.isEdit : false,
      }));
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
      .addCase(saveSubTaskThunk.fulfilled, (state, action) => {
        const subTask = action.payload.data;
        const task = state.tasks.find(t => t.id === subTask.taskId);
        if (task == null) {
          throw new Error(`Something went wrong with task ${subTask.taskId}`);
        }

        if (!task.subtasks) {
          task.subtasks = [];
        }

        const sub = task.subtasks.find(s => s.id === subTask.id);
        if (sub) {
          sub.title = subTask.title;
        } else {
          task.subtasks.push(subTask);
        }
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
      })
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload.data);
      });
  },
});

export const { setLoading, setLoadingState, toggleEditSubTask } =
  sSlice.actions;

export default sSlice.reducer;
