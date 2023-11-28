import axios from 'axios';
import { redirect } from 'react-router-dom';

export const instance = axios.create({
    baseURL: process.env.API_ROOT ?? 'http://localhost:8000/api/'
})

const AUTH_HEADER_TYPE = 'Token'

instance.interceptors.request.use((request) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        request.headers.Authorization = `${AUTH_HEADER_TYPE} ${token}`
    }
    return request
})

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error?.response.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url.localeCompare('login/refresh/')) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refresh_token')
                if (refresh) {
                    const token = await request('login/refresh/', 'post', { refresh })
                    localStorage.setItem('access_token', token.access)
                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `${AUTH_HEADER_TYPE} ${token.access}`
                    const response = await axios(originalRequest)
                    return response
                }
            } catch (error) {
                // Handle refresh token error or redirect to login
                localStorage.removeItem('access_token')
                delete originalRequest.headers.Authorization
                return redirect('/login')
            }
        }
        return Promise.reject(error);
    }
)

export const request = (url, method, data) => {
    return instance.request({ url, method, data })
        .then((response) => response.data)
        .catch((error) => {
            // console.log(error.config);
            // throw error.response?.data;
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // console.log(error.response.headers);
                console.error('Error response:', error.response.status, error.response.data);
                throw new Error(`Error response: ${error.response.status}. ${JSON.stringify(error.response.data)}`)
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.error('Error request:', error.request);
                throw new Error(`Error request: ${JSON.stringify(error.request)}`)
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
                throw new Error(`Error: ${error.message}`)
            }
        })
}