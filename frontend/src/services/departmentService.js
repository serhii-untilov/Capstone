import { request } from "../api"

export async function getDepartments(company_id) {
    return await request(`departments/?company=${company_id}`, 'get')
}

export async function getDepartment(id) {
    return await request(`departments/${id}/`, 'get' )
}

export function postDepartment(department) {
    return request('departments/', 'post', department)
}

export function updateDepartment(department) {
    return request(`departments/${department.id}/`, 'patch', department)
}
