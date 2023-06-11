import api from "@/lib/api";
import { Result } from "@/lib/models/common.model";
import { User } from "@/lib/models/user.model";

export async function fetchUserList() {
  const res = await api.get<User[]>("/be/users");
  return res.data;
}

export async function updateUserDetail(user: User) {
  const res = await api.post<Result<User>>("/be/users/" + user.id, { user });
  return res.data;
}
