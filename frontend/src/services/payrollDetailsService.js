import { request } from "../api"

export async function getPayrollDetails({ employee_id, period }) {
    const params = employee_id
            ? `?employee=${employee_id}&period=${period}`
            : ''
    return await request(`payroll-details/${params}`, 'get')
}

export async function getPayrollDetailsRecord(id) {
    return await request(`payroll-details/${id}`, 'get' )
}

export function postPayrollDetails(record) {
    return request('payroll-details/', 'post', record)
}

export async function updatePayrollDetails(record) {
    return await request(`payroll-details/${record.id}/`, 'patch', record)
}
