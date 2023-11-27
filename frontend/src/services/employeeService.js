import { request } from "../api"

export async function getEmployees() {
    return await request('employees/', 'get')
}

export async function getEmployee(id) {
    return await request(`employees/${id}`, 'get' )
}

export function postEmployee(employee) {
    return request('employees/', 'post', employee)
}

export function updateEmployee(employee) {
    return request(`employees/${employee.id}/`, 'patch', employee)
}
