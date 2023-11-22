export function formatDate(date) {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2)
        month = '0' + month
    if (day.length < 2)
        day = '0' + day

    return [year, month, day].join('-')
}

export function monthBegin(date) {
    const d = new Date(date)
    return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function monthEnd(date) {
    const d = new Date(date)
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

export function dateToTime(date) {
    const d = new Date(date)
    return d.getTime()
}