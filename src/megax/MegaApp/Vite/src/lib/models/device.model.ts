export interface Device {
  id: number;
  name: string;
  deviceCode: string;
  model: string;
  qty: number;
  deviceTypeId: number;
  deviceType: number;
}

export interface DeviceSearch {
  page: number;
  keyword: string;
}

export function EmptyDevice(): Device {
  return {} as Device;
}

export interface DeviceType {
  id: number;
  name: string;
}
