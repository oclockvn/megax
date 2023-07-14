export const isProd = process.env.NODE_ENV === "production";
export const apiUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "NEXT_PUBLIC_BACKEND_URL";
export const authUrl =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "NEXT_PUBLIC_FRONTEND_URL";

export const auth0Domain =
  process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "NEXT_PUBLIC_AUTH0_DOMAIN";
export const auth0ClientId =
  process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "NEXT_PUBLIC_AUTH0_CLIENT_ID";
export const auth0RedirectUrl =
  process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL ||
  "NEXT_PUBLIC_AUTH0_REDIRECT_URL";
