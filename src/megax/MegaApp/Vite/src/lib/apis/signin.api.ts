import { UserLoginResponse } from "../models/login.model";
import { Result } from '../models/common.model'
import api from "./api";

export async function login(username: string, password: string) {
  const response = await api.post<Result<UserLoginResponse>>(
    "/api/auth/user-signin",
    { username, password }
  );
  return response.data
}
