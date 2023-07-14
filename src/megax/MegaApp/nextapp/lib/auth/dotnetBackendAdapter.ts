// import api from "@/lib/api";

// import {
//   Adapter,
//   AdapterAccount,
//   AdapterSession,
//   AdapterUser,
// } from "next-auth/adapters";
// import { delay } from "../util";

// declare type SessionAndUser = { session: AdapterSession; user: AdapterUser };

// export default function DotnetBackendAdapter(): Adapter {
//   return {
//     async createUser(user: Omit<AdapterUser, "id">) {
//       const resp = await api.post<AdapterUser>("/be/auth/createUser", user);
//       return resp.data;
//     },

//     async getUser(id: string) {
//       const resp = await api.get<AdapterUser>("/be/auth/getUser/" + id);
//       return resp.data;
//     },

//     async getUserByEmail(email: string) {
//       const resp = await api.get<AdapterUser>(
//         "/be/auth/getUserByEmail/" + email
//       );
//       return resp.data;
//     },

//     async getUserByAccount({ providerAccountId, provider }) {
//       const resp = await api.get<AdapterUser>(
//         `/be/auth/getUserByAccount/${provider}/${providerAccountId}`
//       );
//       return resp.data;
//     },

//     async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
//       await delay(100);
//       return user as AdapterUser;
//     },

//     async deleteUser(userId: string) {
//       await api.post("/be/auth/deleteUser/" + userId);
//     },

//     async linkAccount(account: AdapterAccount) {
//       const res = await api.post<AdapterAccount>(
//         "/be/auth/linkAccount",
//         account
//       );
//       return res.data;
//     },

//     //     async unlinkAccount({ providerAccountId, provider }) {
//     // return new Promise(() => {})
//     //     },

//     async createSession({
//       sessionToken,
//       userId,
//       expires,
//     }: {
//       sessionToken: string;
//       userId: string;
//       expires: Date;
//     }) {
//       const resp = await api.post<AdapterSession>("/be/auth/createSession", {
//         sessionToken,
//         userId,
//         expires,
//       });

//       return resp.data;
//     },

//     async getSessionAndUser(sessionToken) {
//       const resp = await api.get<SessionAndUser>(
//         "/be/auth/getSessionAndUser/" + sessionToken
//       );
//       return resp.data;
//     },

//     async updateSession(
//       session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
//     ) {
//       const res = await api.post<AdapterSession>(
//         "/be/auth/updateSession",
//         session
//       );
//       return res.data;
//     },

//     async deleteSession(sessionToken: string) {
//       await api.post(`/be/auth/deleteSession/${sessionToken}`);
//     },

//     // async createVerificationToken({ identifier, expires, token }) {
//     //   return
//     // },
//     // async useVerificationToken({ identifier, token }) {
//     //   return
//     // },
//   };
// }
