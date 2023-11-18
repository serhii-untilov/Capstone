import { request } from "../api"

export async function getGroups() {
    const groups = await request('groups/', 'get')
    return groups
}