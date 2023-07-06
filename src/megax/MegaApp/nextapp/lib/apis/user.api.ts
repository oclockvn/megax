import api from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { User, UserDeviceModel } from "@/lib/models/user.model";
import { qs } from "../util";
import { AxiosError } from "axios";

export async function fetchUserList(filter: Partial<Filter>) {
  const res = await api.get<PagedResult<User>>("/be/users?" + qs(filter));
  return res.data;
}

export async function fetchUserDetail(id: number) {
  const res = await api.get<User>("/be/users/" + id);
  return res.data;
}

export async function updateUserDetail(user: User) {
  const res = await api.post<Result<User>>("/be/users/" + user.id, user);
  return res.data;
}

export async function assignDevice(id: number, deviceId: number) {
  try {
    const res = await api.post<Result<UserDeviceModel>>(
      `/be/users/${id}/assign-device/${deviceId}`,
      {}
    );
    return res.data;
  } catch (ex) {
    let msg =
      ex != null && ex instanceof AxiosError
        ? ex.message
        : "SOMETHING WENT WRONG";

    return {
      code: msg,
      success: false,
    } as Result<UserDeviceModel>;
  }
}

export async function getDevices(id: number) {
  const res = await api.get<UserDeviceModel[]>(`/be/users/${id}/devices`);
  return res.data;
}

export async function returnDevice(id: number, deviceId: number) {
  try {
    const res = await api.post<Result<boolean>>(
      `/be/users/${id}/return-device/${deviceId}`,
      {}
    );
    return res.data;
  } catch (ex) {
    let msg =
      ex != null && ex instanceof AxiosError
        ? ex.message
        : "SOMETHING WENT WRONG";

    return {
      code: msg,
      success: false,
      data: false,
    } as Result<boolean>;
  }
}
