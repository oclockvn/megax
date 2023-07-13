import { authOptions } from "@/lib/auth/authOption";
import NextAuth from "next-auth";

// declare type TokenDto = {
//   authToken: string;
//   refreshToken: string;
//   expiryTime: Date;
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
