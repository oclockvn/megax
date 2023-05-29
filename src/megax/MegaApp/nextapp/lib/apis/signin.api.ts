import client from "../api";
import { Result } from "@/lib/models/common.model";
import { SignInResponse } from "@/lib/models/signin.model";

export async function googleSignIn(idToken: string) {
  const res = await client.post<Result<SignInResponse>>(
    "/be/auth/google-signin",
    {
      idToken,
    }
  );
  return res.data;
}

export async function refreshAuthToken(refreshToken: string) {
  const res = await client.post<SignInResponse>("/be/auth/refresh-token", {
    refreshToken,
  });
  return res.data;
}
