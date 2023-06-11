import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { User } from "@/lib/models/user.model";

export async function fetchUserList() {
  const res = await api.get<User[]>("/be/user");
  return res.data;
}

export async function updateUserDetail(user: User) {
  const res = await api.post<Result<User>>("/be/user/" + user.id, { user });
  return res.data;
}
