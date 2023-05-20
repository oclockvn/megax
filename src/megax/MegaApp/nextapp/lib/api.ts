import axios from "axios";
import { handleResponse } from "@/lib/response.intercepter";
import { isProd } from "./config";

const client = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

if (!isProd) {
  client.interceptors.request.use(request => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });
}

client.interceptors.response.use(originalResponse => {
  handleResponse(originalResponse.data);
  return originalResponse;
});

export default client;
