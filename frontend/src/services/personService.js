import { request } from "../api"

export const template = {
    first_name: '',
    last_name: '',
    middle_name: '',
    tax_id: '',
    email: ''
}

export async function getPersons() {
    return await request('persons/', 'get')
}

export async function getPerson(id) {
    return await request(`persons/${id}`, 'get')
}

export function postPerson(person) {
    return request('persons/', 'post', { ...template, ...person })
}

export function updatePerson(person) {
    return request(`persons/${person.id}/`, 'patch', person)
}
