
import { UserSignupResponse } from "../models/signup.model";
import { Result } from '../models/common.model'
import api from "./axios.instance";

export async function signup(username: string, password: string, name: string) {
  const response = await api.post<Result<UserSignupResponse>>(
    "/api/auth/register",
    { username, password, name }
  );

  return response.data
}
