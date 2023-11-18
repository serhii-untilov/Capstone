import axios from 'axios';
import { redirect } from 'react-router-dom';

export const instance = axios.create({
    baseURL: process.env.API_ROOT ?? 'http://localhost:8000/api/'
})

instance.interceptors.request.use((request) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }
    return request
})

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            return redirect('/login')
        }
        return Promise.reject(error)
    }
)

export const request = (url, method, data) => {
    return instance.request({ url, method, data })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data;
        })
}