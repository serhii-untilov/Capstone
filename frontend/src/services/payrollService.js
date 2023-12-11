import { request } from "../api"

export async function getPayroll({ company_id, employee_id, period }) {
    const params = company_id
        ? `?company=${company_id}&period=${period}`
        : employee_id
            ? `?employee=${employee_id}`
            : ''
    return await request(`payroll/${params}`, 'get')
}

export async function getPayrollRecord(id) {
    return await request(`payroll/${id}`, 'get')
}

export function postPayroll(record) {
    return request('payroll/', 'post', record)
}

export async function updatePayroll(record) {
    return await request(`payroll/${record.id}/`, 'patch', record)
}
