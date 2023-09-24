export interface Task {
  id: number;
  reference: string;
  title: string;
  project: string;
  client: string;
  time: Time;
  subtasks: SubTask[];
}

export interface SubTask {
  id: number;
  title: string;
  isFlag: boolean;
  taskId: number;
  isCompleted: boolean;
  isEdit?: boolean;
}

export class Time {
  hour = 0
  minute = 0

  constructor(hr: number, min: number) {
    this.hour = hr;
    this.minute = min;
  }

  format() {
    return `${this.hour}:${this.minute}`;
  }
}

export type SubTaskAction = 'complete' | 'flag' | 'delete'

export type SubTaskActionResult = {
  id: number;
  taskId: number;
  action: SubTaskAction,
}
