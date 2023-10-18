import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import {
  Leave,
  LeaveDate,
  LeaveRequest,
  LeaveStatus,
} from "../models/leave.model";
import dt from "@/lib/datetime";
import { AxiosError } from "axios";
import { extractErrors } from '@/lib/helpers/response';

type _LeaveSummary = {
  leaves: Leave[];
  approvedDates: LeaveDate[];
  capacity: number;
};

export async function fetchLeaveSummary() {
  const res = await api.get<_LeaveSummary>("api/leaves/summary");
  return res.data;
}

export async function fetchLeaves() {
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
  return api
    .post<Result<Leave>>(`api/leaves`, {
      ...request,
      leaveDates: request.leaveDates?.map(d => ({
        ...d,
        date: dt.formatToServer(d.date),
      })),
    })
    .then(res => res.data)
    .catch((error: AxiosError) => {
      let err = error?.response?.data
        ? extractErrors(error.response.data)
        : "Something went wrong";

      return {
        success: false,
        code: err,
      } as Result<Leave>;
    });
}

export async function cancelLeave(id: number) {
  const res = await api.post<Result<LeaveStatus>>(`api/leaves/${id}/cancel`);
  return res.data;
}
