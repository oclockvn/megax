import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { Leave, LeaveRequest, LeaveStatus } from "../models/leave.model";
import dt from "@/lib/datetime";

export async function fetchLeaves() {
  const res = await api.get<Leave[]>("api/leaves");
  return res.data;
}

export async function submitLeave(request: Partial<LeaveRequest>) {
  const res = await api.post<Result<Leave>>(`api/leaves`, {
    ...request,
    leaveDates: request.leaveDates?.map(d => ({
      ...d,
      date: dt.formatToServer(d.date),
    })),
  });
  return res.data;
}
