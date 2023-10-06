export interface Task {
  id: number;
  reference: string;
  title: string;
  project: string;
  projectId?: number;
  client: string;
  clientId?: number;
  time?: Time;
  subTasks: SubTask[];
  status: TaskState;
}

export type TaskAdd = Pick<Task, "clientId" | "projectId" | "title" | "status">;
export type TaskPatchKey = keyof TaskAdd;

export interface SubTask {
  id: number;
  title: string;
  status: SubTaskState;
  taskId: number;
  isEdit?: boolean;
}

export enum TaskState {
  Todo = 0,
  InProgress = 1,
  Completed = 2,
  Archived = 3,
}

export enum SubTaskState {
  New = 0,
  Flagged = 1,
  Completed = 2,
}

export type SubTaskAdd = Pick<SubTask, "title" | "taskId">;
export type SubTaskPatch = keyof Pick<SubTask, "title" | "status">;

export class Time {
  hour = 0;
  minute = 0;

  constructor(time: number) {
    this.hour = Math.floor(time);
    const dec = time % this.hour;
    this.minute = Math.ceil(dec * 100);
  }

  format() {
    return `${this.hour}:${this.minute}`;
  }
}

export type SubTaskAction = "complete" | "flag" | "delete";

export type SubTaskActionResult = {
  id: number;
  taskId: number;
  action: SubTaskAction;
};
