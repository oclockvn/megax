import { Result, UserLoginResponse } from "../models/login.model";
import api from "./axios.instance";

export async function login(username: string, password: string) {
    const response = await api.post<Result<UserLoginResponse>>("/api/auth/user-login", { username, password });

    return response.data
}