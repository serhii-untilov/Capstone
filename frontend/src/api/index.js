import axios from 'axios';
import { redirect } from 'react-router-dom';

export const instance = axios.create({
    baseURL: process.env.API_ROOT ?? 'http://localhost:8000/api/'
})

const AUTH_HEADER_TYPE = 'Token'

instance.interceptors.request.use((request) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        // request.headers.Authorization = `Bearer ${token}`
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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refresh_token');
                const response = await request('login/refresh/', 'post', { refresh });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `${AUTH_HEADER_TYPE} ${response.data.access}`;
                return axios(originalRequest);
            } catch (error) {
                // Handle refresh token error or redirect to login
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
            throw error.response?.data;
        })
}