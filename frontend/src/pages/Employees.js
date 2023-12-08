import { Badge, Table } from "reactstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { getEmployees } from "../services/employeeService";
import { CompanyContext } from "../context/CompanyContext";
import { Toast } from "../components/Toast";
import { dateToTime, monthEnd } from "../services/dateService";
import { FileRuled, Pen, Person, Plus } from "react-bootstrap-icons";
import { Button } from "../components/Button";

export default function Employees() {
    const companyContext = useContext(CompanyContext)
    const navigate = useNavigate()
    const [dataSet, setDataSet] = useState([])
    const [messages, setMessages] = useState([])
    const [view, setView] = useState(localStorage.getItem('employees_view') || 'active')

    const rowData = [
        { title: 'Name', class: '', field: 'full_name' },
        { title: 'Tax ID', class: '', field: 'tax_id' },
        { title: 'Start Date', class: '', field: 'date_from' },
        { title: 'Dismissal Date', class: '', field: 'date_to', view: ['dismissed'] },
        { title: 'Email', class: '', field: 'email' },
    ]

    useEffect(() => {
        const fetchData = async (company) => {
            getEmployees(company.id)
            .then(employees => {
                console.log(employees)
                setDataSet(employees)
            })
            .catch(error => setMessages([error.message || 'Error']))
        }
        if (companyContext?.company?.id) {
            fetchData(companyContext.company)
        }
    }, [companyContext])

    const onNewEmployee = () => {
        navigate('/employee')
    }

    const onEditEmployee = (e) => {
        const id = e.target.dataset.id || e.target.parentElement.dataset.id
        navigate(`/employee/${id}`)
    }

    const onPayrollDetails = (e) => {
        e.preventDefault()
        const id = e.target.dataset.id || e.target.parentElement.dataset.id
        const period = companyContext.company.pay_period
        navigate(`/payroll-details/${id}/${period}`)
    }

    const onRightClick = (e) => {
        if (e.type === 'contextmenu') {
            e.preventDefault()
            const id = e.target.parentElement.dataset.id
            console.log('Right click', id);
        }
    }

    const onSetView = (view) => {
        setView(view)
        localStorage.setItem('employees_view', view)
    }

    const employees_filter = (row, view) => {
        if (view === 'active') {
            return !row.is_deleted &&
                dateToTime(row.date_to) >= dateToTime(companyContext.company.pay_period) &&
                dateToTime(row.date_from) <= dateToTime(monthEnd(companyContext.company.pay_period))
        }
        if (view === 'dismissed') {
            return !row.is_deleted &&
                dateToTime(row.date_to) < dateToTime(companyContext.company.pay_period)
        }
        if (view === 'deleted') {
            return row.is_deleted &&
                dateToTime(row.date_from) <= dateToTime(monthEnd(companyContext.company.pay_period))
        }
    }

    const countActiveEmployees = () => {
        return dataSet.filter(row => !row.is_deleted &&
            dateToTime(row.date_to) >= dateToTime(companyContext.company.pay_period) &&
            dateToTime(row.date_from) <= dateToTime(monthEnd(companyContext.company.pay_period))).length
    }

    const countDismissedEmployees = () => {
        return dataSet.filter(row => !row.is_deleted &&
            dateToTime(row.date_to) < dateToTime(companyContext.company.pay_period)).length
    }

    const countDeletedEmployees = () => {
        return dataSet.filter(row => row.is_deleted &&
            dateToTime(row.date_from) <= dateToTime(monthEnd(companyContext.company.pay_period))).length
    }

    return (
        <>
            {!dataSet ? <h3>Loading...</h3> :
                <div className="col-12 h-100 bg-light py-4 position-relative">
                    <div className="col-12 h-100 bg-white rounded-1 p-3 shadow-sm border border-light-subtle position-relative d-flex flex-column justify-content-between">
                        <div className="header position-relative ">
                            <div className="d-flex justify-content-center flex-wrap">
                                <PageHeader text="Employees" className="col-4 p-0 mb-2" />
                            </div>
                            <div className="d-flex justify-content-center flex-wrap p-0 mb-2">
                                {dataSet
                                    ? <p className="p-0 m-0">You have {countActiveEmployees()} active employees</p>
                                    : null
                                }
                            </div>
                            <div className="d-flex flex-row justify-content-between">
                                <ul class="nav block mb-2">
                                    <li class="nav-item">
                                        <a href="#" className={view === 'active' ? "nav-link active" : 'nav-link'} onClick={() => { onSetView('active') }}>
                                            Active
                                            {/* {countActiveEmployees() ? <Badge color="secondary">{countActiveEmployees()}</Badge> : null} */}
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" className={view === 'dismissed' ? "nav-link active" : 'nav-link'} onClick={() => onSetView('dismissed')}>
                                            Dismissed {countDismissedEmployees() ? <Badge color="secondary">{countDismissedEmployees()}</Badge> : null}
                                        </a>
                                    </li>
                                    {dataSet && countDeletedEmployees() ?
                                        <li class="nav-item">
                                            <a href="#" className={view === 'deleted' ? "nav-link active" : 'nav-link'} onClick={() => onSetView('deleted')}>
                                                Deleted <Badge color="secondary">{countDeletedEmployees()}</Badge>
                                            </a>
                                        </li> : null
                                    }
                                </ul>

                                <div>
                                    <Button color="primary" onClick={onNewEmployee}>
                                        <Plus size={24} /> Add a new employee</Button>
                                </div>
                            </div>
                            {/* <div className="py-5 my-5"> */}
                            <Table
                                // bordered
                                hover
                                responsive
                                className="m-0 p-0"
                            >
                                <thead className="table-light">
                                    <tr>
                                        {rowData
                                            .filter(col => !col.view || col.view.includes(view))
                                            .map(col => (<th className={col.class}>{col.title}</th>))
                                        }
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataSet
                                        .filter(row => employees_filter(row, view))
                                        .map(row => {
                                            return <tr data-id={row.id}
                                                onDoubleClickCapture={onEditEmployee}
                                                onContextMenu={onRightClick}
                                            >
                                                {rowData
                                                    .filter(col => !col.view || col.view.includes(view))
                                                    .map((col) => { return <td>{row[col.field]}</td> })
                                                }
                                                <td className="text-center" data-id={row.id}>
                                                        <Pen className="mx-2 action" size={24} data-id={row.id} onClick={onEditEmployee}/>
                                                        {/* <FileRuled className="mx-2 action" size={24} data-id={row.id} onClick={onPayrollDetails} /> */}
                                                    </td>
                                            </tr>
                                        })}
                                </tbody>
                            </Table>
                            {/* </div> */}
                        </div>
                    </div>
                    <Toast title="Error" messages={messages} close={() => { setMessages([]) }} />

                </div>
            }
        </>
    )
}