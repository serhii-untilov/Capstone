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

export function formatDateTime(date) {
    const d = new Date(date)
    return d.toLocaleDateString('en-us', {
        weekday:"long", year:"numeric", month:"short", day:"numeric",
        hour: "2-digit", minute: "2-digit"
    })
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

export function dateMin() {
    const d = new Date('1900-01-01')
    return d
}

export function dateMax() {
    const d = new Date('9999-12-31')
    return d
}

export function getMonthName(date) {
    const d = new Date(date)
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return names[d.getMonth()]
}

export function getPeriodName(date, format = 'ym') {
    const d = new Date(date)
    const monthName = getMonthName(d)
    const year = d.getFullYear()
    return format.localeCompare('ym') === 0 ? `${year} ${monthName}` : `${monthName} ${year}`
}