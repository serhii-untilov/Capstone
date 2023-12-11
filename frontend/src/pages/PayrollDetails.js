import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { dateMin, dateToTime, getPeriodName, formatDateTime } from "../services/dateService";
import { Table } from "reactstrap";
import { Toast } from "../components/Toast";
import { Button } from "../components/Button";
import { ArrowClockwise } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { getPayrollDetails } from "../services/payrollDetailsService";
import { getEmployee } from "../services/employeeService";
import { getPerson } from "../services/personService";

export default function PayrollDetails({ ...props }) {
    const { id, period } = { ...useParams(), ...props }
    const [pay_period, setPayPeriod] = useState(period)
    const [employee, setEmployee] = useState()
    // const [person, setPerson] = useState()
    const [dataSet, setDataSet] = useState([])
    const [messages, setMessages] = useState([])

    const rowData = [
        { title: 'Payment type', class: '', field: 'payment_name', total_title: 'Net pay' },
        // { title: 'Days', class: '', field: 'days' },
        // { title: 'Hours', class: '', field: 'hours' },
        { title: 'Amount', class: 'text-end', field: 'amount', total: true },
        // { title: 'Date from', class: '', field: 'date_from' },
        // { title: 'Date to', class: '', field: 'date_to' },
    ]

    const fetchPayrollDetails = async (employee_id, period) => {
        getPayrollDetails({ employee_id, period })
            .then(dataSet => setDataSet(dataSet))
            .catch(error => setMessages([error.message || 'Error']))
    }

    useEffect(() => {
        if (id && pay_period) {
            fetchPayrollDetails(id, pay_period)
        }
    }, [id, pay_period])

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                getEmployee(id)
                    .then((employee) => {
                        setEmployee(employee)
                        return getPerson(employee.person)
                    // }).then((person) => {
                    //     setPerson(person)
                    }).catch(error => {
                        setMessages([error.message || 'Error'])
                    })
            } else {
                setEmployee({})
                // setPerson({})
            }
        }
        fetchEmployee()
    }, [id])

    const salaryAccruedDate = () => {
        return dataSet && dataSet.length ? dataSet.reduce((a, b) => {
            return dateToTime(a.created) < dateToTime(b.created) ? b : a
        }, { created: dateMin() }).created
            : null
    }

    const onEdit = (e) => {
        e.preventDefault()
        // TODO
    }

    const onRightClick = (e) => {
        e.preventDefault()
        // TODO
    }

    const onRefresh = (e) => {
        e.preventDefault()
        fetchPayrollDetails(id, pay_period)
    }

    return (
        <>
            {!dataSet ? <h3>Loading...</h3> :
                <div className="col-12 h-100 bg-light py-4 position-relative">
                    <div className="col-12 h-100 bg-white rounded-1 p-3 shadow-sm border border-light-subtle position-relative d-flex flex-column justify-content-between">
                        <div className="h-100 position-relative">
                            <div className="d-flex justify-content-center flex-wrap">
                                <PageHeader text="Payroll" className="col-12 p-0 mb-2" />
                            </div>
                            <h4 className="text-center text-primary mb-2 p-0">{employee?.full_name}</h4>
                            <div className="d-flex justify-content-center flex-wrap p-0 m-0">
                                {pay_period ? <p className="">Pay period: {getPeriodName(pay_period, 'my')}</p> : null}
                            </div>

                            <div className="d-flex flex-row justify-content-between">
                                <div className="nav block mb-2">
                                    {dataSet && salaryAccruedDate()
                                        ? <p className="p-0 m-0">Salary accrued on {formatDateTime(salaryAccruedDate())}.</p>
                                        : <p className="p-0 m-0">Salary not accrued.</p>
                                    }
                                </div>
                                <div>
                                    <Button color="primary" onClick={onRefresh}>
                                        <ArrowClockwise size={24} /></Button>
                                </div>
                            </div>
                            <div height="200px" className="overflow-y:auto">
                                <Table
                                    // height="200"
                                    // bordered
                                    hover
                                    responsive
                                    fixed-header
                                    className="m-0 p-0"
                                >
                                    <thead sticky-top className="table-light sticky-top">
                                        <tr>
                                            {rowData.map(col => (<th className={col.class}>{col.title}</th>))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSet
                                            .map(row => {
                                                return <tr data-id={row.id}
                                                    onDoubleClickCapture={onEdit}
                                                    onContextMenu={onRightClick}
                                                >
                                                    {rowData.map((col) => { return <td className={col.class}>{row[col.field]}</td> })}
                                                </tr>
                                            })}
                                    </tbody>
                                    <thead sticky-top className="table-light sticky-top">
                                        <tr>
                                            {rowData.map(col => (<th className={col.class}>{
                                                col.total ? dataSet.reduce((a, b) => {
                                                    return a + parseInt(b[col.field] || 0) * (b.payment_class === 'Deductions' ? -1 : 1)
                                                }, 0) || ''
                                                : col.total_title || ''
                                            }</th>))}
                                        </tr>
                                    </thead>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <Toast title="Error" messages={messages} close={() => { setMessages([]) }} />
                </div>
            }
        </>
    )
}