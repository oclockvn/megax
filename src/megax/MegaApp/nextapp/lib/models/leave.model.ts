export interface Leave {
  id: number;
  reason: string;
  leaveDate: Date;
  leaveDay: number;
  type: LeaveType;
  note: string;
  submittedDate: Date;
  status: LeaveStatus;
  feedback: string;
  approvedBy?: string;
}

export type LeaveRequest = Pick<Leave, 'reason' | 'leaveDate' | 'leaveDay' | 'type' | 'note'>;

export enum LeaveType {
  Annual = 0,
  Paid = 1,
  TimeInLieu = 2,
  Other = 3,
}

export enum LeaveStatus {
  New = 0,
  Approved = 1,
  Rejected = 2,
  Cancelled = 3,
}
