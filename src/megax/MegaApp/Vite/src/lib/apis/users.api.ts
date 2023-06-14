import { UsersInfo } from "../models/users.model";
import api from "./axios.instance";

export async function fetchUsersInfo() {
    const response = await api.get<UsersInfo[]>("/api/users");

    return response.data.total;
}


export async function fetchSearchUsers(keyword: string) {
    const response = await api.get<UsersInfo[]>(`api/users?query=${keyword}`)
    return response.data.items
}

export async function fetchPageUsers(page: string) {
    const response = await api.get<UsersInfo[]>(`api/users?page=${page}`)
    return response.data.items
}