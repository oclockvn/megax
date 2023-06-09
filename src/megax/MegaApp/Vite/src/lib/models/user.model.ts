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
