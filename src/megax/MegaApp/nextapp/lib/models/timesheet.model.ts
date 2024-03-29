export enum WorkType {
  Office = 1,
  Remote = 2,
}

export type Timesheet = {
  id?: number;
  date: Date;
  workType: WorkType;
};

export type TimesheetViewModel = {
  timesheets: Timesheet[];
  estimated: boolean;
}
