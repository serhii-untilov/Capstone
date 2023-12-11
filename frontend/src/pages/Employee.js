import { Form, FormGroup, Input, Label } from "reactstrap"
import { PageHeader } from "../components/PageHeader"
import { Toast } from "../components/Toast"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEmployee, postEmployee, updateEmployee } from "../services/employeeService"
import { getPerson, postPerson, updatePerson } from "../services/personService"
import { Button } from "../components/Button"
import { CompanyContext } from "../context/CompanyContext"
import { getUser, getUserByEmail } from "../services/userService"
import { getDepartments } from "../services/departmentService"
import { UserContext } from "../context/UserContext"
import { getJobs } from "../services/jobService"
import { Spinner } from "../components/Spinner"
import { Plus } from "react-bootstrap-icons"
import { dateToTime } from "../services/dateService"
import { getEmployeeTypes, getEmploymentStatuses, getWagePerList } from "../services/dictService"

export function Employee() {
    const { id } = useParams()
    const navigate = useNavigate()
    const companyContext = useContext(CompanyContext)
    const userContext = useContext(UserContext)
    const [person, setPerson] = useState()
    const [employee, setEmployee] = useState()
    const [dismissDate, setDismissDate] = useState(null)
    const [user, setUser] = useState()
    const [departments, setDepartments] = useState([])
    const [jobs, setJobs] = useState([])
    const [employmentStatuses, setEmploymentStatuses] = useState([])
    const disabledEmploymentStatuses = [2, 3, 5]
    const [employeeTypes, setEmployeeTypes] = useState([])
    const disabledEmployeeTypes = [2, 4, 5]
    const [wagePerList, setWagePerList] = useState([])
    const disabledWagePerList = [2, 4]
    const [validated, setValidated] = useState(false)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchData = () => {
            getEmploymentStatuses().then(data => setEmploymentStatuses(data)).catch(error => setMessages([...messages, error.message || 'Error']))
            getEmployeeTypes().then(data => setEmployeeTypes(data)).catch(error => setMessages([...messages, error.message || 'Error']))
            getWagePerList().then(data => setWagePerList(data)).catch(error => setMessages([...messages, error.message || 'Error']))
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                getEmployee(id)
                    .then((employee) => {
                        setEmployee(employee)
                        return getPerson(employee.person)
                    }).then((person) => {
                        setPerson(person)
                    }).catch(error => {
                        setMessages([error.message || 'Error'])
                    })
            } else {
                setEmployee({})
                setPerson({})
            }
        }
        fetchEmployee()
    }, [id])

    useEffect(() => {
        const fetchDepartments = () => {
            if (!companyContext?.company) {
                setDepartments([])
            } else {
                getDepartments(companyContext.company.id)
                    .then(departments => setDepartments(departments))
                    .catch(error => setMessages([error.message || 'Error in fetch departments']))
            }
        }
        fetchDepartments()
    }, [companyContext])

    useEffect(() => {
        const fetchJobs = () => {
            if (!userContext?.user) {
                setJobs([])
            } else {
                getJobs(userContext.user.id)
                    .then(jobs => setJobs(jobs))
                    .catch(error => setMessages([error.message || 'Error in fetch jobs']))
            }
        }
        fetchJobs()
    }, [userContext])

    useEffect(() => {
        const fetchUser = async (user_id) => {
            getUser(user_id)
                .then(user => setUser(user))
                .catch(error => setMessages([error.message || 'User not found']))
        }
        if (person?.user) {
            fetchUser(person.user)
        } else {
            setUser({})
        }
    }, [person])

    const getUserName = (user) => {
        return !user ? ''
            : user.first_name ? `${user.first_name} ${user.last_name}`
                : user.username ? user.username
                    : user.email ? user.email
                        : ''
    }

    const getFullName = () => {
        if (person?.first_name || person?.last_name) {
            return `${person?.first_name ? person?.first_name : ''} ${person?.last_name ? person?.last_name : ''}`
        } else {
            return id ? "Noname" : "New employee"
        }
    }

    const onChangeEmail = (email) => {
        setPerson({ ...person, email, user: {} })
        if (email && email.length) {
            getUserByEmail(email).then(response => {
                if (response.length) {
                    setPerson({ ...person, email, user: response.length ? response[0].id : null })
                }
            }).catch(error => {
                console.log(error.message || 'User not found by email.')
            })
        }
    }

    const validate = () => {
        setValidated(true)
        if (!person.first_name) return false
        setValidated(false)
        return true
    }

    const onSaveForm = async e => {
        e.preventDefault()
        if (!validate()) return
        if (id) {
            updatePerson(person)
                .then(() => {
                    return updateEmployee(employee)
                }).then(() => {
                    return navigate(-1)
                }).catch(error => {
                    setMessages([error.message || 'Update person, update employee failed.'])
                    return
                })
        } else if (person?.id) {
            updatePerson(person)
                .then(() => {
                    return postEmployee({ ...employee, person_id: person.id, company_id: companyContext.company.id })
                }).then((newEmployee) => {
                    setEmployee(newEmployee)
                    return navigate(-1)
                }).catch(error => {
                    setMessages([error.message || 'Update person, add employee failed.'])
                    return
                })
        } else {
            postPerson(person)
                .then(newPerson => {
                    setPerson(newPerson)
                    return postEmployee({ ...employee, person: newPerson.id, company: companyContext.company.id })
                }).then(newEmployee => {
                    setEmployee(newEmployee)
                    return navigate(-1)
                }).catch(error => {
                    setMessages([error.message || 'Add person, add employee failed.'])
                })
        }
    }

    const onCancel = () => {
        return navigate(-1)
    }

    const onEditDepartments = (e) => {
        e.preventDefault()
        console.log(e.target)
    }

    const onEditJobs = (e) => {
        e.preventDefault()
        console.log(e.target)
    }

    return (
        <>
            <div className="container col-12 h-100 bg-light pt-4 row mx-lg-auto mx-sm-0 d-flex justify-content-center">
                <div className="col-lg-8 col-sm-12 mx-lg-auto mx-sm-0 ">
                    <Form className="mx-lg-auto mx-sm-0 col-lg-10 col-sm-12 shadow-sm border border-light-subtle p-3 rounded-1 bg-white">
                        <PageHeader text="Employee" className="col-lg-12 col-sm-11 p-0 m-auto" />
                        <p className="col-lg-12 col-sm-12 m-lg-auto mx-sm-0 text-center my-0 p-0">
                            {id
                                ? "Update personal and employee data, and link the user account"
                                : "Creating a card for the new employee"}
                        </p>
                        <h4 className="text-center text-primary m-0 py-3">{getFullName()} {employee &&
                            dateToTime(employee.date_to) < dateToTime('9999-12-31')
                            ? <span class="badge bg-warning text-dark">Dismissed</span>
                            : null} {employee &&
                                employee.is_deleted
                                ? <span class="badge bg-danger">Deleted</span>
                                : null}
                        </h4>
                        <div className="row">
                            <FormGroup className="col-6">
                                {person ?
                                    <>
                                        <Label for="first_name">First name</Label>
                                        <Input id="first_name" name="first_name" type="text"
                                            disabled={ userContext.user.is_employer ? "" : "disabled" }
                                            autoFocus
                                            required
                                            invalid={validated && !person?.first_name}
                                            valid={validated && person?.first_name}
                                            value={person?.first_name}
                                            onChange={e => setPerson({ ...person, first_name: e.target.value })}
                                        />
                                        <div className="invalid-feedback">
                                            Please provide first name.
                                        </div>
                                    </>
                                    : <Spinner />

                                }
                            </FormGroup>
                            <FormGroup className="col-6">
                                <Label for="last_name">Last name</Label>
                                <Input id="last_name" name="last_name" type="text"
                                    disabled={ userContext.user.is_employer ? "" : "disabled" }
                                    value={person?.last_name}
                                    onChange={e => setPerson({ ...person, last_name: e.target.value })}
                                />
                            </FormGroup>
                        </div>

                        <div className="row">

                            <FormGroup className="col-6">
                                <Label for="birth_date">Birth date</Label>
                                <Input id="birth_date" name="birth_date" type="date"
                                    disabled={ userContext.user.is_employer ? "" : "disabled" }
                                    value={person?.birth_date}
                                    onChange={e => setPerson({ ...person, birth_date: e.target.value })}
                                />
                            </FormGroup>

                            <FormGroup className="col-6">
                                <Label for="tax_id">Tax ID</Label>
                                <Input id="tax_id" name="tax_id" type="text"
                                    disabled={ userContext.user.is_employer ? "" : "disabled" }
                                    value={person?.tax_id}
                                    onChange={e => setPerson({ ...person, tax_id: e.target.value })}
                                />
                            </FormGroup>

                        </div>

                        <div className="row">

                            <FormGroup className="col-6">
                                <Label for="email">Email</Label>
                                <Input id="email" name="email" type="text"
                                    disabled={ userContext.user.is_employer ? "" : "disabled" }
                                    value={person?.email}
                                    onChange={e => onChangeEmail(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup className="col-6">
                                <Label for="user">User account</Label>
                                <Input id="user" name="user" type="text"
                                    value={getUserName(user)}
                                    disabled
                                />
                            </FormGroup>

                        </div>

                        {/* <div className="row">
                            <FormGroup className="col-6">
                                {employee ?
                                    <>
                                        <Label for="department">Department</Label>
                                        <div class="input-group">
                                            <Input type="select" id="department" name="department" className="form-select"
                                                default=""
                                                valid={validated}
                                                value={employee?.department}
                                                onChange={e => setEmployee({ ...employee, department: e.target.value })}
                                            >
                                                <option value="" key="0" disabled hidden></option>
                                                {departments ? departments.map(department => {
                                                    return <option key={department.id} value={department.id}>{department.name}</option>
                                                }) : null}

                                            </Input>
                                            <a href="#" className="input-group-text" id="edit-departments" onClick={onEditDepartments}><Plus size={24} /></a>
                                        </div>

                                        <div className="invalid-feedback">
                                            Please define a department.
                                        </div>

                                    </> : null}
                            </FormGroup>

                            <FormGroup className="col-6">
                                {employee ?
                                    <>
                                        <Label for="job">Job title</Label>
                                        <div class="input-group">
                                            <Input type="select" id="job" name="job" className="form-select"
                                                default=""
                                                valid={validated}
                                                value={employee?.job}
                                                onChange={e => setEmployee({ ...employee, job: e.target.value })}
                                            >
                                                <option value="" key="0" disabled hidden></option>
                                                {jobs ? jobs.map(job => {
                                                    return <option key={job.id} value={job.id}>{job.name}</option>
                                                }) : null}
                                            </Input>
                                            <a href="#" className="input-group-text" id="edit-jobs" onClick={onEditJobs}><Plus size={24} /></a>
                                        </div>
                                        <div className="invalid-feedback">
                                            Please define a job.
                                        </div>
                                    </> : null}
                            </FormGroup>

                        </div> */}

                        <div className="row">

                            <FormGroup className="col-6">
                                <Label for="employee_date_from">Start date</Label>
                                <Input id="employee_date_from" name="employee_date_from" type="date"
                                    disabled={ userContext.user.is_employer ? "" : "disabled" }
                                    value={employee?.date_from}
                                    onChange={e => setEmployee({ ...employee, date_from: e.target.value })}
                                />
                            </FormGroup>

                            {employee && dateToTime(employee.date_to) < dateToTime('9999-12-31') ?
                                <FormGroup className="col-6">
                                    <Label for="employee_date_to">Dismissal date</Label>
                                    <Input id="employee_date_to" name="employee_date_to" type="date"
                                        disabled={ userContext.user.is_employer ? "" : "disabled" }
                                        value={employee?.date_to}
                                        onChange={e => setEmployee({ ...employee, date_to: e.target.value })}
                                    />
                                </FormGroup>
                                : null}

                        </div>

                        <div className="row">
                            <FormGroup className="col-6">
                                {employee ?
                                    <>
                                        <Label for="status">Employment Status</Label>

                                            <Input type="select" id="status" name="status" className="form-select"
                                                disabled={ userContext.user.is_employer ? "" : "disabled" }
                                                default="1"
                                                valid={validated}
                                                value={employee?.status}
                                                onChange={e => setEmployee({ ...employee, status: e.target.value })}
                                            >
                                                <option value="" key="0" disabled hidden></option>
                                                {employmentStatuses ? employmentStatuses.map(status => {
                                                    return <option
                                                        disabled={disabledEmploymentStatuses.includes(status.id)}
                                                        key={status.id}
                                                        value={status.id}>
                                                        {status.name}
                                                    </option>
                                                }) : null}

                                            </Input>
                                    </> : null}
                            </FormGroup>

                            <FormGroup className="col-6">
                                {employee ?
                                    <>
                                        <Label for="type">Employee type</Label>
                                        <Input type="select" id="type" name="type" className="form-select"
                                            disabled={ userContext.user.is_employer ? "" : "disabled" }
                                            default="1"
                                            valid={validated && employee?.type}
                                            invalid={validated && !employee?.type}
                                            value={employee?.type}
                                            onChange={e => setEmployee({ ...employee, type: e.target.value })}
                                        >
                                            <option value="" key="0" disabled hidden></option>
                                            {employeeTypes ? employeeTypes.map(type => {
                                                return <option
                                                    disabled={disabledEmployeeTypes.includes(type.id)}
                                                    key={type.id}
                                                    value={type.id}
                                                >{type.name}</option>
                                            }) : null}
                                        </Input>
                                        <div className="invalid-feedback">
                                            Please define an employee type.
                                        </div>
                                    </> : null}
                            </FormGroup>

                        </div>

                        <div className="row">
                            <FormGroup className="col-6">
                                {employee ?
                                    <>
                                        <Label for="type">Wage</Label>
                                        <Input type="number" id="wage" name="wage"
                                            disabled={ userContext.user.is_employer ? "" : "disabled" }
                                            min="0" step="50"
                                            valid={validated}
                                            value={employee?.wage}
                                            onChange={e => setEmployee({ ...employee, wage: e.target.value })}
                                        />
                                    </> : null}
                            </FormGroup>

                            <FormGroup className="col-6">
                                {employee ?
                                    <>
                                        <Label for="wage_per">Wage Per</Label>
                                        <Input type="select" id="wage_per" name="wage_per" className="form-select"
                                            disabled={ userContext.user.is_employer ? "" : "disabled" }
                                            default="3"
                                            valid={validated}
                                            value={employee?.wage_per}
                                            onChange={e => setEmployee({ ...employee, wage_per: e.target.value })}
                                        >
                                            <option value="" key="0" disabled hidden></option>
                                            {wagePerList ? wagePerList.map(wage_per => {
                                                return <option
                                                    disabled={disabledWagePerList.includes(wage_per.id)}
                                                    key={wage_per.id}
                                                    value={wage_per.id}>
                                                    {wage_per.name}
                                                </option>
                                            }) : null}

                                        </Input>
                                    </> : null}
                            </FormGroup>

                        </div>

                        {employee && employee.id && userContext.user.is_employer ?
                        <div className="d-flex justify-content-center mt-3">
                            <Button color="primary" onClick={onSaveForm} className="me-2 btn-fixed-width-75">Save</Button>
                            <Button color="primary" onClick={onCancel} outline className="btn-fixed-width-75">Cancel</Button>
                        </div>
                        : null }
                    </Form>
                </div>

                {employee && employee.id && userContext.user.is_employer ?
                    <div className="p-3 m-0 col-lg-4 col-sm-11">
                        <div className="d-flex flex-column flex-wrap justify-content-center row
                            shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white"
                        >
                            <div>
                                <h5 className="text-center mb-1">Additional actions</h5>
                                <p className="text-center">Save the main form to provide changes after performing additional actions</p>
                            </div>
                            {employee && !employee.is_deleted && dateToTime(employee.date_to) >= dateToTime('9999-12-31') ?
                                <div className="d-flex flex-column justify-content-center border rounded-2 p-3 mb-3">
                                    <p>Need to dismiss this employee?<br />
                                        Enter date and push a Dismiss button.
                                    </p>
                                    <FormGroup>
                                        <Label for="dismiss-date">Dismissal date</Label>
                                        <Input id="dismiss-date" name="dismiss-date" type="date"
                                            value={dismissDate}
                                            onChange={e => setDismissDate(e.target.value)}
                                        />
                                    </FormGroup>
                                    <div className="d-flex justify-content-center">
                                        <Button color="primary"
                                            className={!dismissDate ? "disabled" : ""}
                                            outline onClick={e => setEmployee({ ...employee, date_to: dismissDate })}>Dismiss
                                        </Button>
                                    </div>
                                </div>
                                : null}

                            {employee && !employee.is_deleted && dateToTime(employee.date_to) < dateToTime('9999-12-31') ?
                                <div className="d-flex flex-column justify-content-center border rounded-2 p-3 mb-3">
                                    <p>Cancel dismissal this employee.</p>
                                    <div className="d-flex justify-content-center">
                                        <Button color="primary"
                                            outline onClick={() => setEmployee({ ...employee, date_to: '9999-12-31' })}>
                                            Cancel dismissal
                                        </Button>
                                    </div>
                                </div>
                                : null}

                            {employee && !employee.is_deleted ?
                                <div className="d-flex flex-column justify-content-center border rounded-2 p-3 mb-3">
                                    <p>Need to delete this employee card?<br />
                                        You can restore deleted employee later.
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <Button color="danger" className="danger" outline
                                            onClick={() => setEmployee({ ...employee, is_deleted: true })}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                : null}

                            {employee && employee.is_deleted ?
                                <div className="d-flex flex-column justify-content-center border rounded-2 p-3 mb-3">
                                    <p>Restore deleted employee card.</p>
                                    <div className="d-flex justify-content-center">
                                        <Button color="danger" className="danger" outline
                                            onClick={() => setEmployee({ ...employee, is_deleted: false })}>
                                            Restore deleted
                                        </Button>
                                    </div>
                                </div>
                                : null}

                        </div>

                    </div>

                    : null}
                <Toast title={id ? "Update failed" : "Adding failed"} messages={messages} close={() => { setMessages([]) }} />
            </div>
        </>
    )
}