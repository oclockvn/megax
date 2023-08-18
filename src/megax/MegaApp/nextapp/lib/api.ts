import axios from "axios";
import dateLib from "./datetime";
import storage from "./storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json",
    "x-rewrite-me": 1,
  },
});

api.interceptors.request.use(async request => {
  const token = storage.get('token');

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

api.interceptors.response.use(
  originalResponse => {
    handleResponse(originalResponse.data);
    return originalResponse;
  },
  err => handleRefreshToken(err)
);

function handleRefreshToken(err: any) {
  const originalConfig = err.config;

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

    if (typeof window === "undefined") {
      throw new Error("Token is expired");
    } else {
      window.location.href = "/expired";
    }
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
      body[key] = dateLib.parseISO(value);
    } else if (typeof value === "object") {
      handleResponse(value);
    }
  }
}

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoFormat.test(value);
}

export default api;
