import DotnetBackendAdapter from "@/lib/authLib/dotnetBackendAdapter";
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
          (user as any).jwtToken = validationResult.token; // assign custom token returned from backend
        }
      }
      return true;
    },

    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("> jwt", { token, user, account, profile, isNewUser });
      if (account) {
        // add token to session
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      if (user) {
        token.jwtToken = (user as any).jwtToken; // custom token from backend returned after signin
      }

      return token;
    },

    async session({ session, user, token }) {
      console.log("> session", { session, user, token });

      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken,
        jwtToken: token.jwtToken,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
