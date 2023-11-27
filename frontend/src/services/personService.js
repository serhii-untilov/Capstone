import { request } from "../api"

export async function getPersons() {
    return await request('persons/', 'get')
}

export async function getPerson(id) {
    return await request(`persons/${id}`, 'get' )
}

export function postPerson(person) {
    return request('persons/', 'post', person)
}

export function updatePerson(person) {
    return request(`persons/${person.id}/`, 'patch', person)
}
