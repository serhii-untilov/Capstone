import { useContext, useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { CompanyContext } from "../context/CompanyContext";
import { getPayroll } from "../services/payrollService";
import { dateMin, dateToTime, getPeriodName, formatDateTime } from "../services/dateService";
import { Table } from "reactstrap";
import { Toast } from "../components/Toast";
import { Button } from "../components/Button";
import { ArrowClockwise, FileRuled, Pen } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function Payroll() {
    const companyContext = useContext(CompanyContext)
    const [period, setPeriod] = useState()
    const [dataSet, setDataSet] = useState([])
    const [messages, setMessages] = useState([])
    const navigate = useNavigate()

    const rowData = [
        { title: 'Name', class: '', field: 'full_name' },
        // { title: 'Days', class: '', field: 'days' },
        // { title: 'Hours', class: '', field: 'hours' },
        { title: 'Wage', class: 'text-end', field: 'wage', total: true },
        { title: 'Bonus', class: 'text-end', field: 'bonus', total: true },
        { title: 'Taxes', class: 'text-end', field: 'taxes', total: true },
        { title: 'Deductions', class: 'text-end', field: 'deductions', total: true },
        // { title: 'Payments', class: 'text-end', field: 'payments', total: true },
        { title: 'Net pay', class: 'text-end', field: 'net_pay', total: true },
    ]

    const fetchPayroll = async (company_id, period) => {
        getPayroll({ company_id, period })
            .then(payroll => {
                console.log(payroll)
                setDataSet(payroll)
            })
            .catch(error => setMessages([error.message || 'Error']))
    }

    useEffect(() => {
        if (companyContext?.company?.id && period) {
            fetchPayroll(companyContext?.company?.id, period)
        }
    }, [companyContext, period])

    useEffect(() => {
        if (companyContext?.company?.id) {
            setPeriod(companyContext.company.pay_period)
        }
    }, [companyContext])

    const salaryAccruedDate = () => {
        return dataSet && dataSet.length ? dataSet.reduce((a, b) => {
            return dateToTime(a.created) < dateToTime(b.created) ? b : a
        }, { created: dateMin() }).created
            : null
    }

    const onPayrollDetails = (e) => {
        e.preventDefault()
        const id = e.target.dataset.id || e.target.parentElement.dataset.id
        navigate(`/payroll-details/${id}/${period}`)
    }

    const onEditEmployee = (e) => {
        e.preventDefault()
        const id = e.target.dataset.id || e.target.parentElement.dataset.id
        navigate(`/employee/${id}`)
    }

    const onRightClick = (e) => {
        e.preventDefault()
        // TODO
    }

    const onRunPayroll = (e) => {
        e.preventDefault()
        fetchPayroll(companyContext?.company?.id, period)
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
                            {/* <h4 className="text-center text-primary mb-2 p-0">{companyContext?.company?.name}</h4> */}
                            <div className="d-flex justify-content-center flex-wrap p-0 m-0">
                                {period ? <p className="">Pay period: {getPeriodName(period, 'my')}</p> : null}
                            </div>

                            <div className="d-flex flex-row justify-content-between">
                                {dataSet && salaryAccruedDate()
                                    ? <p className="p-0 m-0">Salary accrued on {formatDateTime(salaryAccruedDate())}.</p>
                                    : <p className="p-0 m-0">Salary not accrued.</p>
                                }
                                <div>
                                    <Button color="primary" className="mb-1" onClick={onRunPayroll}>
                                        <ArrowClockwise size={24} /> Run Payroll</Button>
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
                                                    <td className="text-center" data-id={row.employee}>
                                                        <Pen className="mx-2 action" size={20} data-id={row.employee} onClick={onEditEmployee} />
                                                        <FileRuled className="mx-2 action" size={20} data-id={row.employee} onClick={onPayrollDetails} />
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