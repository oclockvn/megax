export interface User {
  id: number;
  email: string;
  fullName: string;
  dob?: Date;
  address: string;
  phone: string;
  identityNumber: string;
}

export interface UserDeviceRecord {
  id: number;
  name: string;
  serialNumber: string;
  deviceType: string;
  takenAt: Date;
  returnedAt?: Date;
}
