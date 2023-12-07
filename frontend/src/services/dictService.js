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

export async function getEmploymentStatuses() {
    return await request('employment-statuses/', 'get')
}

export async function getEmployeeTypes() {
    return await request('employee-types/', 'get')
}

export async function getWagePerList() {
    return await request('wage-per-list/', 'get')
}

export async function getPaymentTypes() {
    return await request('payment-types/', 'get')
}