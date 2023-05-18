export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (allow anonymous)
     * - about (allow anonymous)
     * - favicon.ico (favicon file)
     */
    "/((?!api|auth|about|favicon.ico).*)",
  ],
};
