export interface Device {
  id: number;
  name: string;
  model: string;
  deviceCode: string;
  deviceTypeId: number;
}

export interface DeviceType {
  id: number;
  name: string;
}
