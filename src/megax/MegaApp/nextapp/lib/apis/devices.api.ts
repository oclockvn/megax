import api from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { qs } from "../util";
import { Device, DeviceType } from "../models/device.model";

export async function fetchDeviceList(filter: Partial<Filter> | undefined) {
  const query = filter ? qs(filter) : "";
  const res = await api.get<PagedResult<Device>>("/be/devices?" + query);
  return res.data;
}

export async function fetchDeviceDetail(id: number) {
  const res = await api.get<Device>("/be/devices/" + id);
  return res.data;
}

export async function updateDevice(req: Device) {
  const res = await api.put<Result<Device>>("/be/devices/" + req.id, req);
  return res.data;
}

export async function addDevice(req: Omit<Device, "id">) {
  const res = await api.post<Result<Device>>("/be/devices", req);
  return res.data;
}

export async function deleteDevice(id: number) {
  const res = await api.delete<Result<Device>>("/be/devices/" + id);
  return res.data;
}

export async function getDeviceTypes() {
  const res = await api.get<DeviceType[]>("/be/devices/device-types");
  return res.data;
}
