export const isProd = process.env.NODE_ENV === "production";
export const apiUrl = process.env.BACKEND_URL || "http://localhost:3001";
export const authUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const auth0Domain = process.env.AUTH0_DOMAIN || "invalid";
export const auth0ClientId = process.env.AUTH0_CLIENT_ID || "invalid";
