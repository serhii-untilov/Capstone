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
import { Pen, Plus, PlusLg } from "react-bootstrap-icons"
import { AdditionalActions } from "../components/AdditionalActions"

export function Employee() {
    const { id } = useParams()
    const navigate = useNavigate()
    const companyContext = useContext(CompanyContext)
    const userContext = useContext(UserContext)
    const [person, setPerson] = useState()
    const [employee, setEmployee] = useState()
    const [user, setUser] = useState()
    const [departments, setDepartments] = useState([])
    const [jobs, setJobs] = useState([])
    const [validated, setValidated] = useState(false)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                getEmployee(id).then((employee) => {
                    setEmployee(employee)
                }).catch(error => {
                    setMessages([error.message || 'Error'])
                })
            } else {
                setEmployee({})
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
        const fetchPerson = async () => {
            if (employee?.person) {
                setPerson(await getPerson(employee.person))
            } else {
                setPerson({})
            }
        }
        fetchPerson()
    }, [employee])

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

            <div className="col-12 h-100 bg-light pt-4">
                <Form className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                    <PageHeader text="Employee" className="col-lg-12 col-sm-11 p-0 m-auto" />
                    <p className="col-lg-12 col-sm-11 m-auto text-center my-0 p-0">
                        {id
                            ? "Update personal and employee data, and link the user account"
                            : "Creating a card for the new employee"}
                    </p>
                    <h4 className="text-center text-primary m-0 pt-3">{getFullName()}</h4>
                    <FormGroup>
                        {person ?
                            <>
                                <Label for="first_name">First name</Label>
                                <Input id="first_name" name="first_name" type="text"
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
                    <FormGroup>
                        <Label for="last_name">Last name</Label>
                        <Input id="last_name" name="last_name" type="text"
                            value={person?.last_name}
                            onChange={e => setPerson({ ...person, last_name: e.target.value })}
                        />
                    </FormGroup>

                    <div className="row">

                        <FormGroup className="col-6">
                            <Label for="tax_id">Tax ID</Label>
                            <Input id="tax_id" name="tax_id" type="text"
                                value={person?.tax_id}
                                onChange={e => setPerson({ ...person, tax_id: e.target.value })}
                            />
                        </FormGroup>

                        <FormGroup className="col-6">
                            <Label for="date_from">Birth date</Label>
                            <Input id="date_from" name="date_from" type="date"
                                value={person?.date_from}
                                onChange={e => setPerson({ ...person, date_from: e.target.value })}
                            />
                        </FormGroup>

                    </div>

                    <div className="row">

                        <FormGroup className="col-6">
                            <Label for="email">Email</Label>
                            <Input id="email" name="email" type="text"
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

                    <FormGroup className="mb-3 col-12">
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

                    <FormGroup className="mb-3 col-12">
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

                    <div className="d-flex justify-content-center">
                        <Button color="primary" onClick={onSaveForm} className="me-2 btn-fixed-width-75">Save</Button>
                        <Button color="primary" onClick={onCancel} outline className="btn-fixed-width-75">Cancel</Button>
                    </div>
                </Form>
                <Toast title={id ? "Update failed" : "Adding failed"} messages={messages} close={() => { setMessages([]) }} />
                <AdditionalActions>
                    <div className="d-flex flex-column flex-wrap justify-content-center">
                        <div className="d-flex justify-content-center">
                            <h5>Additional actions</h5>
                        </div>
                        <div className="d-flex flex-column justify-content-center border rounded-2 p-3 mb-3">
                            <p>Need to dismiss this employee?<br/>
                                Enter date and push a Dismiss button
                            </p>
                            <FormGroup>
                            <Label for="date_to">Dismissal date</Label>
                            <Input id="date_to" name="date_to" type="date"
                                value=""
                                onChange={e => setEmployee({ ...employee, date_to: e.target.value })}
                            />
                            </FormGroup>
                            <div className="d-flex justify-content-center">
                                <Button color="primary" outline>Dismiss</Button>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center border rounded-2 p-3 mb-3">
                            <p>Need to delete this employee card?<br/>
                            Dangerous action.<br/>
                            But you can restore deleted employee later.
                            </p>
                            <div className="d-flex justify-content-center">
                            <Button color="danger" className="danger" outline>Delete</Button>
                            </div>
                        </div>
                    </div>
                </AdditionalActions>
            </div>
        </>
    )
}