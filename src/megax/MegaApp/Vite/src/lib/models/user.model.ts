export interface User {
    id: number;
    email: string;
    fullName: string;
    dob?: Date;
    address: string;
    phone: string;
    identityNumber: string;
}

export interface UsersSearch {
  page: number;
  keyword: string;
}


export function EmptyUser(): User {
  return {} as User;
}

export interface UserDeviceRecord {
  id: number;
  name: string;
  serialNumber: string;
  deviceType: string;
  takenAt: Date;
  returnedAt?: Date;
}
