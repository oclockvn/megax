import api from "@/lib/api";
import { Role } from "../models/role.model";
import { Result } from "../models/common.model";
import { UserRole } from "../models/user.model";

export async function getUserRoles(id: number) {
  const res = await api.get<Role[]>(`api/userroles/${id}/roles`);
  return res.data;
}

export async function updateUserRoles(id: number, roles: number[]) {
  const res = await api.post<Result<number[]>>(`api/userroles/${id}/roles`, roles);
  return res.data;
}
