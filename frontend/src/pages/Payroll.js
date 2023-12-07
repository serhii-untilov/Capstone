import { useContext, useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { CompanyContext } from "../context/CompanyContext";
import { getPayroll } from "../services/payrollService";
import { dateMin, dateToTime } from "../services/dateService";
import { Table } from "reactstrap";
import { Toast } from "../components/Toast";

export default function Payroll() {
    const companyContext = useContext(CompanyContext)
    const [dataSet, setDataSet] = useState([])
    const [messages, setMessages] = useState([])

    const rowData = [
        { title: 'Name', class: '', field: 'employee' },
        { title: 'Days', class: '', field: 'days' },
        { title: 'Hours', class: '', field: 'hours' },
        { title: 'Wage', class: '', field: 'wage' },
        { title: 'Bonus', class: '', field: 'bonus' },
        { title: 'Taxes', class: '', field: 'taxes' },
        { title: 'Deductions', class: '', field: 'deductions' },
        { title: 'Payments', class: '', field: 'payments' },
    ]

    useEffect(() => {
        const fetchData = async (company, period) => {
            getPayroll({ company_id: company.id, period: company.pay_period })
                .then(payroll => {
                    setDataSet(payroll)
                })
                .catch(error => setMessages([error.message || 'Error']))
        }
        if (companyContext?.company?.id) {
            fetchData(companyContext.company)
        }
    }, [companyContext])

    const salaryAccruedDate = () => {
        return dataSet.reduce((a, b) => {
            return dateToTime(a.created) < dateToTime(b.created) ? b : a
        }, {created: dateMin()})
    }

    const onEdit = (e) => {
        e.preventDefault()
        // TODO
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
                        <div className="header position-relative">
                            <div className="d-flex justify-content-center flex-wrap">
                                <PageHeader text="Payroll" className="col-4 p-0 m-0" />
                            </div>
                            <div className="d-flex justify-content-center flex-wrap p-0 m-0">
                                {dataSet
                                    ? <p className="p-0 m-0">Salary accrued on {salaryAccruedDate()}.</p>
                                    : null
                                }
                            </div>

                            <Table
                                bordered
                                hover
                                responsive
                                className="m-0 p-0"

                            >
                                <thead className="table-light">
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
                                                {rowData.map((col) => { return <td>{row[col.field]}</td> })}
                                            </tr>
                                        })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <Toast title="Error" messages={messages} close={() => { setMessages([]) }} />
                </div>
            }
        </>
    )
}