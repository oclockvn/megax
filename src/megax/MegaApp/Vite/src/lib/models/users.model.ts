export type UsersInfo = {
    fullName: string,
    email: string,
    dob: number,
    identityNumber: number,
    address: string;
    id: number;
    phone: number;
};

export interface UsersSearch {
    page: number,
    keyword: string
}
