import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import {
  SubTask,
  SubTaskAction,
  Task,
  TaskAdd,
  TaskPatchKey,
} from "../models/task.model";
import {
  saveSubTask,
  deleteTask as deleteTask,
  fetchTasks,
  handleSubTaskAction,
  addTask,
  patchTask,
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

export const patchTaskThunk = createAsyncThunk(
  "tasks/patch-task",
  async (
    data: { id: number; key: TaskPatchKey; value: string | number },
    _thunkApi
  ) => {
    return await patchTask(data.id, data.key, data.value);
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
      if (!task || !task.subTasks) {
        throw new Error("500");
      }

      const { id } = action.payload;
      task.subTasks = task.subTasks.map(t => ({
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

        if (!task.subTasks) {
          task.subTasks = [];
        }

        const sub = task.subTasks.find(s => s.id === subTask.id);
        if (sub) {
          sub.title = subTask.title;
        } else {
          task.subTasks.push(subTask);
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

        const subTask = task.subTasks.find(s => s.id === id);
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
            task.subTasks = task?.subTasks.filter(s => s.id !== id);
            break;
        }
      })
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload.data);
      })
      .addCase(patchTaskThunk.fulfilled, (state, action) => {
        const id = action.payload.data.id;
        const task = state.tasks.find(t => t.id === id);
        if (!task) {
          return;
        }

        const { title } = action.payload.data;
        task.title = title;
      });
  },
});

export const { setLoading, setLoadingState, toggleEditSubTask } =
  sSlice.actions;

export default sSlice.reducer;
