import { request } from "../api"
import { dateMax, formatDate } from "./dateService"

export function newEmployee() {
    return {
        person_id: null,
        date_from: formatDate(Date.now()),
        date_to: formatDate(dateMax()),
        department: '',
        job: '',
        status: 1,
        type: 1,
        wage: 0,
        wage_per: 3,
    }
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
    return request('employees/', 'post', {...newEmployee(), ...employee})
}

export function updateEmployee(employee) {
    return request(`employees/${employee.id}/`, 'patch', employee)
}
