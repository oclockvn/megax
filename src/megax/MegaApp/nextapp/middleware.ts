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
    // "/((?!api|be|login|about|favicon.ico).*)",
    "/admin/:path*",
    "/portal/:path*",
  ],
};
