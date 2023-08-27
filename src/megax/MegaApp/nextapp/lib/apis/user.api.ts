import api from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { User, UserDeviceRecord } from "@/lib/models/user.model";
import { qs } from "../util";
import { AxiosError } from "axios";
import { Contact } from "../models/contact.model";

export async function fetchUserList(filter: Partial<Filter>) {
  const res = await api.get<PagedResult<User>>("api/users?" + qs(filter));
  return res.data;
}

export async function fetchUserDetail(id: number) {
  const res = await api.get<User>("api/users/" + id);
  return res.data;
}

export async function updateUserDetail(user: User) {
  const res = await api.post<Result<User>>("api/users/" + user.id, user);
  return res.data;
}

export async function assignDevice(id: number, deviceId: number) {
  try {
    const res = await api.post<Result<UserDeviceRecord>>(
      `api/users/${id}/assign-device/${deviceId}`,
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
    } as Result<UserDeviceRecord>;
  }
}

export async function getDevices(id: number) {
  const res = await api.get<UserDeviceRecord[]>(`api/users/${id}/devices`);
  return res.data;
}

export async function returnDevice(id: number, deviceId: number) {
  try {
    const res = await api.post<Result<boolean>>(
      `api/users/${id}/return-device/${deviceId}`,
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

export async function creteUpdateContact(id: number, req: Partial<Contact | null>) {
  const res = await api.post<Result<Contact>>(`api/users/${id}/contact`, req);
  return res.data;
}

export async function deleteContact(id: number, contactId: number) {
  const res = await api.delete<Result<boolean>>(`api/users/${id}/contact/${contactId}`);
  return res.data;
}
