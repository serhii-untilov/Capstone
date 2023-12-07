import { request } from "../api"

export async function getPayrollDetails() {
    return await request('payroll-details/', 'get')
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
