import { useContext, useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { CompanyContext } from "../context/CompanyContext";
import { getPayroll } from "../services/payrollService";
import { dateMin, dateToTime, getPeriodName, formatDateTime } from "../services/dateService";
import { Table } from "reactstrap";
import { Toast } from "../components/Toast";
import { Button } from "../components/Button";
import { ArrowClockwise, FileRuled, Pen, Person, PersonGear } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getEmployeeByUserId } from "../services/employeeService";

export default function EmployeePayroll() {
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const [employee, setEmployee] = useState()
    const [dataSet, setDataSet] = useState([])
    const [messages, setMessages] = useState([])
    const navigate = useNavigate()

    const rowData = [
        // { title: 'Name', class: '', field: 'full_name' },
        // { title: 'Days', class: '', field: 'days' },
        // { title: 'Hours', class: '', field: 'hours' },
        { title: 'Pay period', class: '', field: 'pay_period' },
        { title: 'Wage', class: 'text-end', field: 'wage', total: true },
        { title: 'Bonus', class: 'text-end', field: 'bonus', total: true },
        { title: 'Taxes', class: 'text-end', field: 'taxes', total: true },
        { title: 'Deductions', class: 'text-end', field: 'deductions', total: true },
        // { title: 'Payments', class: 'text-end', field: 'payments', total: true },
        { title: 'Net pay', class: 'text-end', field: 'net_pay', total: true },
    ]

    const fetchData = async (company_id, user_id) => {
        getEmployeeByUserId(company_id, user_id)
            .then(data => {
                setEmployee(data[0])
                return data[0]
            }).then(employee => {
                return getPayroll({ employee_id: employee.id })
            }).then(payroll => {
                setDataSet(payroll)
            })
            .catch(error => setMessages([error.message || 'Error']))
    }

    useEffect(() => {
        if (companyContext.company?.id && userContext.user?.id) {
            fetchData(companyContext.company.id, userContext.user.id)
        }
    }, [companyContext, userContext])

    const onPayrollDetails = (e) => {
        e.preventDefault()
        const id = e.target.dataset.id || e.target.parentElement.dataset.id
        const period = e.target.dataset.period || e.target.parentElement.dataset.period
        navigate(`/payroll-details/${id}/${period}`)
    }

    const onRightClick = (e) => {
        e.preventDefault()
        // TODO
    }

    return (
        <>
            {!dataSet ? <h3>Loading...</h3> :
                <div className="col-12 h-100 bg-light py-4 position-relative">
                    <div className="col-12 h-100 bg-white rounded-1 p-3 shadow-sm border border-light-subtle position-relative d-flex flex-column justify-content-between">
                        <div className="h-100 position-relative">
                            <div className="d-flex justify-content-center flex-wrap">
                                <PageHeader text="Payroll" className="col-4 p-0 mb-2" />
                            </div>
                            <h4 className="text-center text-primary mb-2 p-0">{employee?.full_name}</h4>

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
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSet
                                            .map(row => {
                                                return <tr data-id={row.employee}
                                                    onDoubleClickCapture={onPayrollDetails}
                                                    onContextMenu={onRightClick}
                                                >
                                                    {rowData.map((col) => { return <td className={col.class}>{row[col.field]}</td> })}
                                                    <td className="text-center" data-id={row.employee} data-period={row.pay_period}>
                                                        <FileRuled className="mx-2 action" size={20} data-id={row.employee}  data-period={row.pay_period} onClick={onPayrollDetails} />
                                                    </td>
                                                </tr>
                                            })}
                                    </tbody>
                                    <thead sticky-top className="table-light sticky-top">
                                        <tr>
                                            {rowData.map(col => (<th className={col.class}>{
                                                col.total ? dataSet.reduce((a, b) => a + parseInt(b[col.field] || 0), 0) || '' : ''
                                            }</th>))}
                                            <th className="text-center"></th>
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