import { request } from "../api"

export async function getJobs(user_id) {
    return await request(`jobs/?user=${user_id}`, 'get')
}

export async function getJob(id) {
    return await request(`jobs/${id}/`, 'get' )
}

export function postJob(job) {
    return request('jobs/', 'post', job)
}

export function updateJob(job) {
    return request(`jobs/${job.id}/`, 'patch', job)
}
