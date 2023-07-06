import { Filter, PagedResult, Result } from "../models/common.model";
import { Device, DeviceType } from "../models/device.model";
import { qs } from "../until";
import api from "./api";

export async function fetchDeviceList(filter: Partial<Filter> | undefined) {
  const res = await api.get<PagedResult<Device>>("/api/devices?" + qs(filter));
  return res.data;
}

export async function fetchDeviceDetail(id: number) {
  const res = await api.get<Device>("/api/devices/" + id);
  return res.data;
}

export async function getDeviceTypes() {
  const res = await api.get<DeviceType[]>("/api/devices/device-types");
  return res.data;
}
export async function updateDeviceDetail(device: Device) {
  const res = await api.post<Result<Device>>("/api/users/" + device.id, device);
  return res.data;
}
