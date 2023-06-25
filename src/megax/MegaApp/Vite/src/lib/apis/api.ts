

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


export function handleResponse(body: any) {
    if (body == null || typeof body !== "object") {
        return body;
    }
}


export default api;