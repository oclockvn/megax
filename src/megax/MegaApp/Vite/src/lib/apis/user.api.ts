import { Filter, PagedResult, Result } from "../models/common.model";
import { User } from "../models/user.model";
import { qs } from "../until";
import api from "./api";

export async function fetchUserList(filter: Partial<Filter>) {
  const res = await api.get<PagedResult<User>>("api/users?" + qs(filter));
  return res.data;
}

export async function fetchUserDetail(id: number) {
  const res = await api.get<User>("/api/users/" + id);
  return res.data;
}

export async function updateUserDetail(user: User) {
  const res = await api.post<Result<User>>("api/user/" + user.id, user);
  return res.data;
}
// export async function updateUserDetail(user: User) {
//   const res = await api.post<Result<User>>("/be/users/" + user.id, user);
//   return res.data;
// }

// export async function signup(username: string, password: string, name: string) {
//   const response = await api.post<Result<UserSignupResponse>>(
//     "/api/auth/register",
//     { username, password, name }
//   );
//   return response.data;
// }
