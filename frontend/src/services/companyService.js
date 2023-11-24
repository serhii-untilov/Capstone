import { request } from "../api"

export async function getCompanies() {
    return await request('companies/', 'get')
}

export async function getCompany(id) {
    return await request(`companies/${id}`, 'get' )
}

export function postCompany(company) {
    return request('companies/', 'post', company)
}

export async function updateCompany(company) {
    return await request(`companies/${company.id}/`, 'patch', company)
}
