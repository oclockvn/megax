import axios from "axios";
import storage from "../storage";

const api = axios.create({
  //baseURL: '',
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

axios.interceptors.request.use(function (config) {
  const token = storage.get("token");
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
