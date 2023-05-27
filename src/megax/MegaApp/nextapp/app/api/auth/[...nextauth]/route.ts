import { googleSignIn } from "@/lib/apis/signin.api";
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
    async signIn({ user, account }) {
      // validate token in the backend
      if (account && account.id_token) {
        const validationResult = await googleSignIn(account.id_token);
        if (validationResult.isSuccess) {
          // assign custom token returned from backend
          const { token, refreshToken } = validationResult.data;
          (user as any).authToken = token;
          (user as any).refreshToken = refreshToken;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // custom token from backend returned after signin
        const { authToken, refreshToken } = user as any;
        token.authToken = authToken;
        token.refreshToken = refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        authToken: token.authToken,
        refreshToken: token.refreshToken,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
