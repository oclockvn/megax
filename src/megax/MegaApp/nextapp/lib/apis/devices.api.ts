import api from "@/lib/api";
import { Filter, PagedResult, Result } from "@/lib/models/common.model";
import { qs } from "../util";
import { Device } from "../models/device.model";

export async function fetchDeviceList(filter: Partial<Filter>) {
  const res = await api.get<PagedResult<Device>>("/be/devices?" + qs(filter));
  return res.data;
}

export async function fetchDeviceDetail(id: number) {
  const res = await api.get<Device>("/be/devices/" + id);
  return res.data;
}

export async function updateDevice(req: Device) {
  const res = await api.post<Result<Device>>("/be/devices/" + req.id, req);
  return res.data;
}
