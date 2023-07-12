import api from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { qs } from "../util";
import { Device, DeviceOwnerRecord, DeviceType } from "../models/device.model";

export async function fetchDeviceList(filter: Partial<Filter> | undefined) {
  const query = filter ? qs(filter) : "";
  const res = await api.get<PagedResult<Device>>("/api/devices?" + query);
  return res.data;
}

export async function fetchDeviceDetail(id: number) {
  const res = await api.get<Device>("/api/devices/" + id);
  return res.data;
}

export async function updateDevice(req: Device) {
  const res = await api.put<Result<Device>>("/api/devices/" + req.id, req);
  return res.data;
}

export async function addDevice(req: Omit<Device, "id">) {
  const res = await api.post<Result<Device>>("/api/devices", req);
  return res.data;
}

export async function deleteDevice(id: number) {
  const res = await api.delete<Result<Device>>("/api/devices/" + id);
  return res.data;
}

export async function getDeviceTypes() {
  const res = await api.get<DeviceType[]>("/api/devices/device-types");
  return res.data;
}

export async function fetchDeviceOwners(id: number) {
  const res = await api.get<DeviceOwnerRecord[]>(`/api/devices/${id}/owners`);
  return res.data;
}
