import axios from "axios";

const api = axios.create({
  //baseURL: '',
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

// todo: define interceptor

export default api;
