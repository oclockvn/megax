

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

    // console.log("> axios intercepter", {
    //     status: err.response.status,

    // });

    // if not 401 unauthorized -> skip it
    // if (!err.response || err.response.status !== 401) {
    //     return Promise.reject(err);
    // }

    // forbidden
    // if (err.response.status === 403 && err.response.data) {
    //     return Promise.reject(err.response.data);
    // }

    // Access Token was expired
    // todo: handle if first request to protected resouces
    if (err.response.status === 401) {
        storage.remove("token");
        window.location.href = "/login";


    }

    return Promise.reject(err);
}




export default api;