import client from "../api";

declare type GoogleValidationResult = {
  token: string;
};

export async function validateGoogleToken(idToken: string) {
  const res = await client.post<GoogleValidationResult>(
    "/be/auth/validateGoogleToken",
    { idToken }
  );
  return res.data;
}
