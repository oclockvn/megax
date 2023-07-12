export interface Device {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  deviceTypeId: number;
  disabled: boolean;
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

export interface DeviceOwnerRecord {
  id: number;
  fullName: string;
  email: string;
  takenAt: Date;
  returnedAt?: Date;
}
