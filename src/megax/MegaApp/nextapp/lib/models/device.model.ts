export interface Device {
  id: number;
  name: string;
  model: string;
  deviceCode: string;
  deviceTypeId: number;
  disabled: boolean;
}

export interface DeviceType {
  id: number;
  name: string;
}

export interface DeviceOwner {
  userId: number;
  fullName: string;
  email: string;
  qty: number;
}
