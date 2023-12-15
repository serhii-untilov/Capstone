import { request } from "../api"

export function newPerson() {
    return {
        first_name: '',
        last_name: '',
        middle_name: '',
        tax_id: '',
        email: '',
        user: null,
    }
}

export async function getPersons() {
    return await request('persons/', 'get')
}

export async function getPerson(id) {
    return await request(`persons/${id}`, 'get')
}

export function postPerson(person) {
    return request('persons/', 'post', { ...newPerson(), ...person })
}

export function updatePerson(person) {
    return request(`persons/${person.id}/`, 'patch', person)
}
