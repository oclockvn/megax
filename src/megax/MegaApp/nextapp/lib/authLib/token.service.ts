import client from "../api";

// declare type GoogleValidationResult = {
//   token: string;
// };

declare type AuthValidationResult = {
  token: string;
  refreshToken: string;
}

export async function validateGoogleToken(idToken: string) {
  const res = await client.post<AuthValidationResult>(
    "/be/auth/validateGoogleToken",
    { idToken }
  );
  return res.data;
}

export async function refreshToken(refreshToken: string) {
  const res = await client.post<AuthValidationResult>("/be/auth/refreshToken", { refreshToken })
  return res.data
}
