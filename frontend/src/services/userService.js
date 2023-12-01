import { request } from "../api"

const anonymousUser = {
    id: null,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: false,
    is_active: false,
    is_superuser: false,
    groups: [],
    is_authenticated: false,
    is_anonymous: true,
}

export function getAnonymousUser() {
    return anonymousUser
}

export async function getUsers() {
    const data = await request('users/', 'get')
    return data
}

export async function getUser(id) {
    try {
        const data = await request(`users/${id}`, 'get')
        return data
    } catch(e) {
        console.error(e)
        return anonymousUser
    }
}

export async function currentUser() {
    try {
        const data = await request('current_user/', 'post')
        return data
    } catch(e) {
        console.error(e)
        return anonymousUser
    }
}

export async function updateUser(user) {
    return await request(`users/${user.id}/`, 'patch', user)
}

export async function getUserByEmail(email) {
    return await request(`users/?email=${email}`, 'get')
}