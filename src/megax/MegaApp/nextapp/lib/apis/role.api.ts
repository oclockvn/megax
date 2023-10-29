import api from "@/lib/api";
import { Role } from "../models/role.model";

export async function getRoles() {
  const res = await api.get<Role[]>("api/roles");
  return res.data;
}
