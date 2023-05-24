import { validateGoogleToken } from "@/lib/authLib/token.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // adapter: DotnetBackendAdapter(), // no longer use custom adapter
  // debug: true,
  // session: { // without custom adapter, session uses jwt strategy by default so no need to specify it again
  //   strategy: "jwt",
  // },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("> signin", { user, account, profile, email, credentials });
      // validate token in the backend
      if (account && account.id_token) {
        const validationResult = await validateGoogleToken(account.id_token);
        if (validationResult?.token) {
          // assign custom token returned from backend
          (user as any).jwtToken = validationResult.token;
          (user as any).refreshToken = validationResult.refreshToken;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // console.log("---jwt triggered");
      console.log("> jwt", {
        token,
        user,
        account,
        // profile,
        // isNewUser,
        // trigger,
      });
      if (account) {
        // add token to session
        // token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      if (user) {
        // custom token from backend returned after signin
        const { jwtToken, refreshToken } = user as any;
        token.jwtToken = jwtToken;
        token.refreshToken = refreshToken;
      }

      // use refresh token to override expired token
      // if (trigger === "update" && session?.jwtToken) {
      //   token.jwtToken = session.jwtToken;
      //   token.refreshToken = session.refreshToken;
      // }

      return token;
    },

    async session({ session, user, token, trigger }) {
      console.log("> session", { session, user, token, trigger });

      return {
        ...session,
        // accessToken: token.accessToken,
        idToken: token.idToken,
        // jwtToken: token.jwtToken,
        // refreshToken: token.refreshToken,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
