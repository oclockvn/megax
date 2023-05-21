import DotnetBackendAdapter from "@/lib/adapters/dotnetBackendAdapter";
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
  adapter: DotnetBackendAdapter(),
  // debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   console.log("> signin", { user, account, profile, email, credentials });
    //   return true;
    // },
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
      return token;
    },

    async session({ session, user, token }) {
      console.log("> session", { session, user, token });

      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
