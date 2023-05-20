import client from "@/lib/api";

import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "next-auth/adapters";
import { delay } from "../util";

declare type SessionAndUser = { session: AdapterSession; user: AdapterUser };

export default function DotnetBackendAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      console.log("createUser", user);
      const resp = await client.post<AdapterUser>("/be/auth/createUser", user);
      return resp.data;
    },

    async getUser(id: string) {
      console.log("getUser", id);
      const resp = await client.get<AdapterUser>("/be/auth/getUser/" + id);
      return resp.data;
    },

    async getUserByEmail(email: string) {
      console.log("getUserByEmail", email);
      const resp = await client.get<AdapterUser>(
        "/be/auth/getUserByEmail/" + email
      );
      return resp.data;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", providerAccountId, provider);
      const resp = await client.get<AdapterUser>(
        `/be/auth/getUserByAccount/${provider}/${providerAccountId}`
      );
      return resp.data;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      console.log("updateUser", user);
      await delay(100);
      return user as AdapterUser;
    },

    async deleteUser(userId: string) {
      console.log("deleteUser", userId);
      await client.post("/be/auth/deleteUser/" + userId);
    },

    async linkAccount(account: AdapterAccount) {
      console.log("linkAccount", account);
      const res = await client.post<AdapterAccount>(
        "/be/auth/linkAccount",
        account
      );
      return res.data;
    },

    //     async unlinkAccount({ providerAccountId, provider }) {
    // return new Promise(() => {})
    //     },

    async createSession({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      console.log("createSession", { sessionToken, userId, expires });
      const resp = await client.post<AdapterSession>("/be/auth/createSession", {
        sessionToken,
        userId,
        expires,
      });

      return resp.data;
    },

    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser", sessionToken);
      const resp = await client.get<SessionAndUser>(
        "/be/auth/getSessionAndUser/" + sessionToken
      );
      return resp.data;
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      console.log("updateSession", session);
      const res = await client.post<AdapterSession>(
        "/be/auth/updateSession",
        session
      );
      return res.data;
    },

    async deleteSession(sessionToken: string) {
      console.log("deleteSession", sessionToken);
      await client.post(`/be/auth/deleteSession/${sessionToken}`);
    },

    // async createVerificationToken({ identifier, expires, token }) {
    //   return
    // },
    // async useVerificationToken({ identifier, token }) {
    //   return
    // },
  };
}
