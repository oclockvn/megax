export const isProd = process.env.NODE_ENV === "production";
export const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "NEXT_PUBLIC_BACKEND_URL";
export const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "NEXT_PUBLIC_FRONTEND_URL";

export const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "NEXT_PUBLIC_AUTH0_DOMAIN";
export const auth0ClientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "NEXT_PUBLIC_AUTH0_CLIENT_ID";
export const auth0Audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "NEXT_PUBLIC_AUTH0_AUDIENCE";
export const auth0Issuer = process.env.NEXT_PUBLIC_AUTH0_ISSUER || "NEXT_PUBLIC_AUTH0_ISSUER";

export const googleClientId = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID"
