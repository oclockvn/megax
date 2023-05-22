import axios from "axios";
import { handleResponse } from "@/lib/response.intercepter";
import { getSession } from "next-auth/react";
import { authUrl } from "./config";

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

client.interceptors.response.use(originalResponse => {
  handleResponse(originalResponse.data);
  return originalResponse;
});

export default client;
