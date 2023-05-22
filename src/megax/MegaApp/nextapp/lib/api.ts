import axios from "axios";
import { handleResponse } from "@/lib/response.intercepter";
import { getSession, useSession } from "next-auth/react";
import { authUrl } from "./config";
import { refreshToken } from "./authLib/token.service";

const client = axios.create({
  baseURL: authUrl,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

client.interceptors.request.use(async request => {
  const session = await getSession();
  const token = session ? (session as any)["jwtToken"] : null; // we inject token to session in jwt callback

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

client.interceptors.response.use(
  originalResponse => {
    if (originalResponse.status === 401) {
      // refresh token
    }

    handleResponse(originalResponse.data);
    return originalResponse;
  },
  async err => {
    const originalConfig = err.config;
    console.log("> axios intercepter", err.response);

    // if not 401 unauthorized -> skip it
    if (!err.response || err.response.status !== 401) {
      return Promise.reject(err);
    }

    if (err.response.status === 403 && err.response.data) {
      return Promise.reject(err.response.data);
    }

    // Access Token was expired
    // todo: handle if first request to protected resouces
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // const rs = await refreshToken();
        // const { accessToken } = rs.data;
        const session = useSession();
        const sessionData = session as any;

        const token = await refreshToken(sessionData.refreshToken);
        // set to session
        // session
        session.update({
          jwtToken: token.token,
          refreshToken: token.refreshToken,
        }); // accessToken will be availabed in jwt callback in next auth

        return client(originalConfig);
      } catch (_error) {
        // exception when refresh token
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default client;
