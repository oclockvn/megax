export interface User {
  id: number;
  email: string;
  fullName: string;
  dob?: Date;
  address: string;
  phone: string;
  identityNumber: string;
}

export interface UserDeviceModel {
  id: number;
  deviceId: number;
  name: string;
  model: string;
  deviceType: string;
}
