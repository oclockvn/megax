// import loading from "@/app/(portal)/loading";
import dt from "@/lib/datetime";
// import { makeArrOf } from "@/lib/helpers/array";
import {
  Leave,
  LeaveStatus,
  LeaveType,
  LeaveDate,
  LeaveTime,
} from "@/lib/models/leave.model";

export const useQueue = (items: Leave[]) =>
  items.filter(x => x.status === LeaveStatus.New);

export const usePast = (items: Leave[]) =>
  items.filter(x => x.status !== LeaveStatus.New);

export const useTakenAnnual = (items: Leave[]) =>
  items
    .filter(l => l.type === LeaveType.Annual)
    .reduce((prev: LeaveDate[], { leaveDates }) => [...prev, ...leaveDates], [])
    .filter(d => dt.isPast(d.date))
    .reduce((prev, curr) => prev + (curr.time === LeaveTime.All ? 2 : 1), 0) /
  2;

export const useTakenPaid = (items: Leave[]) =>
  items
    .filter(l => l.type === LeaveType.Paid)
    .reduce((prev: LeaveDate[], { leaveDates }) => [...prev, ...leaveDates], [])
    .filter(d => dt.isPast(d.date))
    .reduce((prev, curr) => prev + (curr.time === LeaveTime.All ? 2 : 1), 0) /
  2;

export const useRequestedDates = (items: Leave[]) =>
  items.reduce(
    (prev: Date[], { leaveDates }) => [...prev, ...leaveDates.map(d => d.date)],
    []
  );
