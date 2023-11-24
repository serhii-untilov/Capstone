import { request } from "../api"

export async function getGroups() {
    return await request('groups/', 'get')
}

export async function getLawList() {
    return await request('laws/', 'get')
}

export async function getAccountingList() {
    return await request('accounting/', 'get')
}