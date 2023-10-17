import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { Leave, LeaveDate, LeaveRequest, LeaveStatus } from "../models/leave.model";
import dt from "@/lib/datetime";
import { delay } from "../util";

type _LeaveSummary = {
  leaves: Leave[],
  approvedDates: LeaveDate[],
  capacity: number,
}

export async function fetchLeaveSummary() {
  await delay(2000);
  const res = await api.get<_LeaveSummary>("api/leaves/summary");
  return res.data;
}

export async function fetchLeaves() {
  await delay(2000);
  const res = await api.get<Leave[]>("api/leaves");
  return res.data;
}

export async function fetchRequestingLeaves() {
  const res = await api.get<Leave[]>("api/leaves/requesting");
  return res.data;
}

export async function approveLeave(id: number) {
  const res = await api.post<Result<LeaveStatus>>(`api/leaves/${id}/approve`);
  return res.data;
}

export async function submitLeave(request: Partial<LeaveRequest>) {
  await delay(2000);
  const res = await api.post<Result<Leave>>(`api/leaves`, {
    ...request,
    leaveDates: request.leaveDates?.map(d => ({
      ...d,
      date: dt.formatToServer(d.date),
    })),
  });
  return res.data;
}

export async function cancelLeave(id: number) {
  const res = await api.post<Result<LeaveStatus>>(`api/leaves/${id}/cancel`);
  return res.data;
}
