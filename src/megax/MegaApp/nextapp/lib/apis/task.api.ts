import api, { upload } from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { User, UserDeviceRecord } from "@/lib/models/user.model";
import { normalizeDateTimePayload, qs, toFormData } from "../util";
import { AxiosError } from "axios";
import { Contact } from "../models/contact.model";
import { Document as UserDocument } from "../models/document.model";
import {
  Time,
  Task,
  SubTask,
  SubTaskAction,
  SubTaskActionResult,
  TaskAdd,
  TaskPatchKey,
  SubTaskAdd,
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

export async function saveSubTask(subtask: Partial<SubTaskAdd>) {
  const res = await api.post<Result<SubTask>>(`api/tasks/subtask`, subtask);
  return res.data;
}

export async function handleSubTaskAction(
  id: number,
  taskId: number,
  action: SubTaskAction
) {
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({
    code: "",
    data: { id, action, taskId },
    success: true,
  } as Result<SubTaskActionResult>);
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
  // const res = await api.delete<Result<boolean>>(`api/todos/${id}`);
  // return res.data;
  return Promise.resolve({
    code: "",
    data: { id, [key]: value as any },
    success: true,
  } as Result<Task>);
}
