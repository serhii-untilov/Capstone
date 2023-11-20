import { request } from "../api"

export async function getUsers() {
    const data = await request('users/', 'get')
    return data
}

export async function getUser(id) {
    const data = await request(`users/${id}`, 'get')
    return data
}
