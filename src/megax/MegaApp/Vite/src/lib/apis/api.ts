import axios from "axios";
import storage from "../storage";

const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
})

api.interceptors.request.use(function (config) {
    const token = storage.get("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    r => r,
    err => handleRefreshToken(err)
);

function handleRefreshToken(err: any) {
    if (err.response.status === 401) {
        storage.remove("token");
        window.location.href = "/login";
    }
    return Promise.reject(err);
}

export default api;
