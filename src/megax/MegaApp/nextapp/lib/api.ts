import axios from "axios";
import { authUrl } from "./config";
import { getSession } from "next-auth/react";
import dateLib from "./datetime";

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
  const token = session ? (session as any)["authToken"] : null; // we inject token to session in jwt callback

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

client.interceptors.response.use(
  originalResponse => {
    handleResponse(originalResponse.data);
    return originalResponse;
  }
  // async err => handleRefreshToken(err)
);

function handleRefreshToken(err: any) {
  const originalConfig = err.config;
  console.log("> axios intercepter", {
    status: err.response.status,
    retried: originalConfig._retry,
  });

  // if not 401 unauthorized -> skip it
  if (!err.response || err.response.status !== 401) {
    return Promise.reject(err);
  }

  // forbidden
  if (err.response.status === 403 && err.response.data) {
    return Promise.reject(err.response.data);
  }

  // Access Token was expired
  // todo: handle if first request to protected resouces
  if (err.response.status === 401 && !originalConfig._retry) {
    originalConfig._retry = true;

    // try {
    //   const refreshTokenValue = storage.getRefreshToken();
    //   if (refreshTokenValue) {
    //     const tokenResult = await refreshToken(refreshTokenValue);
    //     if (tokenResult && tokenResult.token) {
    //       storage.setToken(tokenResult.token);
    //       storage.setRefreshToken(tokenResult.refreshToken);

    //       return client(originalConfig);
    //     }
    //   }
    // } catch (_error) {
    //   // exception when refresh token
    //   return Promise.reject(_error);
    // }
  }

  return Promise.reject(err);
}

const isoFormat =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

export function handleResponse(body: any) {
  if (body == null || typeof body !== "object") {
    return body;
  }

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) {
      // console.log(`${body[key]} -> ${value}`);
      body[key] = dateLib.parseISO(value);
    } else if (typeof value === "object") {
      handleResponse(value);
    }
  }
}

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoFormat.test(value);
}

export default client;
