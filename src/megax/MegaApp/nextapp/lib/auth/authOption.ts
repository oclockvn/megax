// import { googleSignIn, refreshAuthToken } from "@/lib/apis/signin.api";
// import datetime from "@/lib/datetime";
// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// declare type TokenDto = {
//   authToken: string;
//   refreshToken: string;
//   expiryTime: Date;
// };

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       // validate and assign token in the backend
//       if (account && account.id_token) {
//         const validationResult = await googleSignIn(account.id_token);
//         if (!validationResult || !validationResult.success) {
//           return false;
//         }

//         const { token, refreshToken, expiryTime } = validationResult.data;
//         (user as any).authToken = token;
//         (user as any).refreshToken = refreshToken;
//         (user as any).expiryTime = expiryTime;
//       }

//       return true;
//     },

//     async jwt({ token, user, session }) {
//       let authToken = "";
//       let refreshToken = "";
//       let expiryTime: Date | undefined;

//       if (user) {
//         // custom token from backend returned after signin
//         const apiUser = user as Partial<TokenDto>;
//         authToken = apiUser.authToken || "";
//         refreshToken = apiUser.refreshToken || "";
//         expiryTime = apiUser.expiryTime;
//       }

//       // note: this is backend refresh token
//       // we haven't done frontend refresh token yet
//       const tokenExp = datetime.parseFromServer(token.expiryTime as string);
//       if (tokenExp <= new Date() && token.refreshToken) {
//         const refreshTokenRes = await refreshAuthToken(
//           token.authToken as string,
//           token.refreshToken as string
//         );

//         if (refreshTokenRes.success) {
//           authToken = refreshTokenRes.data.token;
//           refreshToken = refreshTokenRes.data.refreshToken;
//           expiryTime = refreshTokenRes.data.expiryTime;
//         } else {
//           // undone: handle unsuccess refresh token
//         }
//       }

//       if (authToken) {
//         token.authToken = authToken;
//         token.refreshToken = refreshToken;
//         token.expiryTime = expiryTime;
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       return {
//         ...session,
//         authToken: token.authToken,
//         refreshToken: token.refreshToken,
//         expiryTime: token.expiryTime,
//       };
//     },
//   },
// };
