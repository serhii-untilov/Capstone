import { request } from "../api"

export const newEmployee = {
    person_id: null
}

export async function getEmployees(company_id) {
    return await request(`employees/?company=${company_id}`, 'get')
}

export async function getEmployee(id) {
    return await request(`employees/${id}/`, 'get' )
}

export async function getEmployeeByUserId(company_id, user_id) {
    return await request(`employees/?company=${company_id}&user=${user_id}`, 'get')
}

export function postEmployee(employee) {
    return request('employees/', 'post', employee)
}

export function updateEmployee(employee) {
    return request(`employees/${employee.id}/`, 'patch', employee)
}
