import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Filter } from "../models/common.model";
import {
  SubTaskAdd,
  SubTaskPatch,
  SubTaskState,
  Task,
  TaskAdd,
  TaskPatchKey,
  TaskState as TaskStatus,
} from "../models/task.model";
import {
  patchSubTask,
  deleteTask as deleteTask,
  fetchTasks,
  addTask,
  patchTask,
  addSubTask,
  deleteSubTask,
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
    return await fetchTasks();
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

export const patchSubTaskThunk = createAsyncThunk(
  "tasks/patch-subtask",
  async (
    data: {
      id: number;
      taskId: number;
      key: SubTaskPatch;
      value: string | number;
    },
    _thunkApi
  ) => {
    const { id, key, value, taskId } = data;
    return await patchSubTask(id, taskId, key, value);
  }
);

export const addSubTaskThunk = createAsyncThunk(
  "tasks/add-subtask",
  async (payload: SubTaskAdd, _thunkApi) => {
    return await addSubTask(payload);
  }
);

export const deleteSubTaskThunk = createAsyncThunk(
  "tasks/delete-subtask",
  async (payload: { id: number; taskId: number }, _thunkApi) => {
    return await deleteSubTask(payload.id, payload.taskId);
  }
);

// export const handleSubTaskThunk = createAsyncThunk(
//   "tasks/handle-subtask",
//   async (
//     payload: { id: number; taskId: number; action: SubTaskAction },
//     _thunkApi
//   ) => {
//     return await handleSubTaskAction(
//       payload.id,
//       payload.taskId,
//       payload.action
//     );
//   }
// );

export type EditSubTaskType = { id: number; taskId: number };

const reorderTasks = (tasks: Task[]) => {
  const inCompleted = tasks.filter(t => t.status !== TaskStatus.Completed);
  const completed = tasks.filter(t => t.status === TaskStatus.Completed);
  return inCompleted.concat(completed);
};

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
        state.tasks = reorderTasks(action.payload);
        state.loading = false;
      })
      .addCase(fetchTaskListThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addSubTaskThunk.fulfilled, (state, action) => {
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
      .addCase(patchSubTaskThunk.fulfilled, (state, action) => {
        const {
          data: { id, taskId, key, value },
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

        switch (key) {
          case "title":
            subTask.title = value as string;
            break;
          case "status":
            subTask.status = value as SubTaskState;
            break;
        }
      })
      .addCase(deleteSubTaskThunk.fulfilled, (state, action) => {
        const {
          data: { id, taskId },
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

        task.subTasks = task?.subTasks.filter(s => s.id !== id);
      })
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload.data);
      })
      .addCase(patchTaskThunk.fulfilled, (state, action) => {
        if (!action.payload.success) {
          return;
        }

        const { id, status, title, projectId } = action.payload.data;
        const task = state.tasks.find(t => t.id === id);
        if (!task) {
          return;
        }

        if (status === TaskStatus.Archived) {
          state.tasks = state.tasks.filter(t => t.id !== id);
          return;
        }

        task.title = title;
        task.status = status;
        task.projectId = projectId;

        if (
          action.meta.arg.key === "status" &&
          action.meta.arg.value === TaskStatus.Completed
        ) {
          // reorder tasks
          state.tasks = reorderTasks(state.tasks);
        }
      });
  },
});

export const { setLoading, setLoadingState, toggleEditSubTask } =
  sSlice.actions;

export default sSlice.reducer;
