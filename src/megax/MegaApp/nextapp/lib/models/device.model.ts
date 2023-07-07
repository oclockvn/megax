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

export interface DeviceOwnerRecord {
  id: number;
  fullName: string;
  email: string;
  takenAt: Date;
  returnedAt?: Date;
}
