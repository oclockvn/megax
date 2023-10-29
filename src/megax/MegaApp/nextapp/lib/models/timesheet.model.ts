export enum WorkStatus {
  Office = 1,
  Remote = 2,
}

export type WorkDay = {
  date: Date;
  status: WorkStatus;
};
