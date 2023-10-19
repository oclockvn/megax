export interface Leave {
  id: number;
  reason: string;
  // leaveDate: Date;
  // leaveDay: number;
  leaveDates: LeaveDate[];
  type: LeaveType;
  note: string;
  status: LeaveStatus;
  comment: string | undefined;
  approvedBy?: string;
  isCreator: boolean;
  createdAt: Date;
  userId: number;
  userName: string;
}

export type LeaveRequest = Pick<Leave, 'reason' | 'leaveDates' | 'type' | 'note'>;

export enum LeaveType {
  Annual = 0,
  Paid = 1,
  TimeInLieu = 2,
}

export enum LeaveStatus {
  New = 0,
  Approved = 1,
  Rejected = 2,
  Cancelled = 3,
}

export enum LeaveTime {
  All = 0,
  AM = 1,
  PM = 2,
}

export type LeaveDate = {
  id: number;
  date: Date;
  time: LeaveTime;
};

export enum LeaveAction {
  Approve = 0,
  Reject = 1,
  Cancel = 2,
}

export type LeaveActionRequest = {
  action: LeaveAction;
  comment: string | undefined;
}

export const LeaveTypeDescriptionMapping = {
  [LeaveType.Annual]: 'Annual leave',
  [LeaveType.Paid]: 'Paid leave',
  [LeaveType.TimeInLieu]: 'Time off in lieu',
  // [LeaveType.Other]: 'Other'
}

export const LeaveStatusMapping = {
  [LeaveStatus.New]: 'Requested',
  [LeaveStatus.Approved]: 'Approved',
  [LeaveStatus.Cancelled]: 'Cancelled',
  [LeaveStatus.Rejected]: 'Rejected',
}
