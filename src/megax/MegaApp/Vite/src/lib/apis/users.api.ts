import { UsersInfo } from "../models/users.model";
import api from "./axios.instance";

export async function fetchUsersInfo() {
    const response = await api.get<UsersInfo[]>("/api/users");

    return response.data
}


export async function fetchSearchUser(keyword: string) {
    const response = await api.get<UsersInfo[]>(`api/users?query=${keyword}`)
    return response.data
}

export async function fetchPageUser(page: string) {
    const response = await api.get<UsersInfo[]>(`api/users?query=${page}`)
    return response.data.items
}