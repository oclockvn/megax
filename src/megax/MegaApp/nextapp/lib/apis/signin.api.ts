import api from "../api";
import { Result } from "@/lib/models/common.model";
import { SignInResponse } from "@/lib/models/signin.model";

export async function googleSignIn(idToken: string) {
  const res = await api.post<Result<SignInResponse>>(
    "/api/auth/google-signin",
    {
      idToken,
    }
  );
  return res.data;
}

export async function refreshAuthToken(token: string, refreshToken: string) {
  const res = await api.post<Result<SignInResponse>>(
    "/api/auth/refresh-token",
    {
      token,
      refreshToken,
    }
  );
  return res.data;
}
