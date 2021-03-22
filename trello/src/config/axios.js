import axios from 'axios'
import { manage_errors } from "./errors";

const clientAxios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    maxContentLength: 100000000,
    maxBodyLength: 1000000000,
});

export const clientAxiosDownload = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    maxContentLength: 100000000,
    maxBodyLength: 1000000000,
    responseType: 'blob'
});

clientAxios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    manage_errors(error, true, 'info')
    return Promise.reject(error);
});

export default clientAxios;