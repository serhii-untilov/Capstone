import { request } from "../api"

export async function register(credentials) {
    const data = await request('register/', 'post', credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data.access
}

export async function login(credentials) {
    const data = await request('login/', 'post', credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data.access
}

export async function logout() {
    try {
        const refresh = localStorage.getItem('refresh_token')
        await request('logout/', 'post', { refresh })
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    } catch (error) {
        console.log(error)
    }
}
