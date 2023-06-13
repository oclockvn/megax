import api from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { User } from "@/lib/models/user.model";
import { qs } from "../util";
// import { delay } from "../util";

export async function fetchUserList(filter: Partial<Filter>) {
  const res = await api.get<PagedResult<User>>("/be/users?" + qs(filter));
  // await delay(2000);
  return res.data;
}

export async function updateUserDetail(user: User) {
  const res = await api.post<Result<User>>("/be/users/" + user.id, { user });
  return res.data;
}
