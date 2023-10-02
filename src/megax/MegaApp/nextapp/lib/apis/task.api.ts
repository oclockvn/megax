import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import {
  Task,
  SubTask,
  TaskAdd,
  TaskPatchKey,
  SubTaskAdd,
  SubTaskPatch,
} from "../models/task.model";

export async function fetchTasks() {
  const res = await api.get<Task[]>("api/tasks");
  return res.data;
}

export async function deleteTask(id: number) {
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({
    code: "",
    data: id,
    success: true,
  } as Result<number>);
}

export async function addSubTask(subtask: Partial<SubTaskAdd>) {
  const res = await api.post<Result<SubTask>>(`api/tasks/subtask`, subtask);
  return res.data;
}

type DeleteSubTaskResult = {
  id: number;
  taskId: number;
};

export async function deleteSubTask(id: number, taskId: number) {
  const res = await api.delete<Result<DeleteSubTaskResult>>(
    `api/tasks/subtask/${id}`
  );

  const result: Result<DeleteSubTaskResult> = {
    code: res.data.code,
    data: { id, taskId },
    success: res.data.success,
  };

  return result;
}

export async function patchSubTask(
  id: number,
  taskId: number,
  key: SubTaskPatch,
  value: string | number
) {
  const res = await api.put<Result<SubTask>>(`api/tasks/${id}/patch-subtask`, {
    key,
    [key]: value,
  });

  const result: Result<{
    id: number;
    taskId: number;
    key: SubTaskPatch;
    value: string | number;
  }> = {
    code: res.data.code,
    data: { id, taskId, key, value },
    success: res.data.success,
  };
  return result;
}

export async function addTask(task: TaskAdd) {
  const res = await api.post<Result<Task>>(`api/tasks`, task);
  return res.data;
}

export async function patchTask(
  id: number,
  key: TaskPatchKey,
  value: string | number
) {
  const res = await api.post<Result<Task>>(`api/tasks/${id}/patch`, {
    key,
    [key]: value,
  });
  return res.data;
}
