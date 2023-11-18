import { request } from "../api"

export async function register(credentials) {
    localStorage.clear()
    const data = await request('register/', 'post', credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
}

export async function login(credentials) {
    localStorage.clear()
    const data = await request('login/', 'post', credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
}

export async function logout() {
    const token = localStorage.getItem('access_token')
    try {
        await request('logout/', 'post', {token})
    } catch(error) {
        console.log(error)
    }
    localStorage.clear()
}

