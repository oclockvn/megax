import api, { upload } from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import {
  AccessControlModel,
  User,
  UserCard,
  UserDeviceRecord,
} from "@/lib/models/user.model";
import { normalizeDateTimePayload, qs, toFormData } from "../util";
import { AxiosError } from "axios";
import { Contact } from "../models/contact.model";
import { Document as UserDocument } from "../models/document.model";
import dt from "@/lib/datetime";
import { Timesheet, TimesheetViewModel, WorkType } from "../models/timesheet.model";
import { extractErrors } from "../helpers/response";

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

export async function createUpdateContact(
  id: number,
  req: Partial<Contact | null>
) {
  const res = await api.post<Result<Contact>>(`api/users/${id}/contact`, req);
  return res.data;
}

export async function deleteContact(id: number, contactId: number) {
  const res = await api.delete<Result<boolean>>(
    `api/users/${id}/contact/${contactId}`
  );
  return res.data;
}

export async function createUpdateDocument(
  id: number,
  req: Partial<UserDocument | null>,
  files?: File[]
) {
  const payload = normalizeDateTimePayload(req!);
  const res = await upload<Result<UserDocument>>(
    `api/users/${id}/document`,
    toFormData(payload!, files)
  );
  return res.data;
}

export async function deleteDocument(id: number, documentId: number) {
  const res = await api.delete<Result<boolean>>(
    `api/users/${id}/document/${documentId}`
  );
  return res.data;
}

export async function getUserCard(id: number) {
  const res = await api.get<UserCard>(`api/users/${id}/card`);
  return res.data;
}

export async function getCurrentUserRolesAndPermissions() {
  const res = await api.get<AccessControlModel>(
    `api/users/roles-and-permissions`
  );
  return res.data;
}

export async function applyTimesheet(timesheet: Timesheet[]) {
  return api
    .post<Result<boolean>>(`api/users/timesheet`, {
      timesheet: timesheet.map(t => ({
        ...t,
        date: dt.formatToServer(t.date, true)
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
      } as Result<boolean>;
    });
}

export async function getTimesheet(current: Date) {
  const res = await api.get<TimesheetViewModel>(
    `api/users/timesheet?current=${dt.formatToServer(current, true)}`
  );
  return res.data;
}
