import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { PageHeader } from "../components/PageHeader"
import { Toast } from "../components/Toast"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getEmployee, postEmployee, updateEmployee } from "../services/employeeService"
import { getPerson, postPerson, updatePerson } from "../services/personService"

export function Employee() {
    const { id } = useParams()
    const [employee, setEmployee] = useState()
    const [person, setPerson] = useState()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                setEmployee(await getEmployee(id))
            } else {
                setEmployee({})
            }
        }
        fetchEmployee()
    }, [id])

    useEffect(() => {
        const fetchPerson = async () => {
            if (employee?.person?.id) {
                setPerson(await getPerson(employee.person.id))
            } else {
                setPerson({})
            }
        }
        fetchPerson()
    }, [employee])

    const getFullName = () => {
        if (person?.first_name || person?.last_name) {
            return `${person?.first_name ? person?.first_name : ''} ${person?.last_name ? person?.last_name : ''}`
        }
        return null
    }

    const onSaveForm = async () => {
        if (id) {
            updatePerson({ ...person }).then(() => {
                updateEmployee({ ...employee }).catch(e => setMessages([e.message || 'Error.']))
            }).catch(e => setMessages([e.message || 'Error.']))
        } else {
            if (person?.id) {
                updatePerson({ ...person }).then(person => {
                    postEmployee({ ...employee, person_id: person.id }).catch(e => setMessages([e.message || 'Error.']))
                }).catch(e => setMessages(e.message || 'Error.'))

            } else {
                postPerson({ ...person }).then(person => {
                    setPerson(person)
                    postEmployee({ ...employee, person_id: person.id }).then((employee) => {
                        setEmployee(employee)
                    }).catch(e => setMessages([e.message || 'Error.']))
                }).catch(e => setMessages([e.message || 'Error.']))
            }
        }
    }

    return (
        <>
            <div className="col-12 h-100 bg-light pt-4">
                <Form className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                    <PageHeader text="Employee" className="col-lg-5 col-sm-11 m-auto text-center" />
                    <p className="col-lg-12 col-sm-11 m-auto text-center my-0 p-3">
                        {id
                            ? "Update personal and employee data, and link the user account"
                            : "Creating a card for the new employee"}
                    </p>
                    <h4 className="text-center text-primary m-0 p-0">{!id ? getFullName() ? getFullName() : "New Employee" : getFullName()}</h4>
                    <FormGroup>
                        <Label for="first_name">First name</Label>
                        <Input id="first_name" name="first_name" type="text"
                            autoFocus
                            required
                            value={person?.first_name}
                            onChange={e => setPerson({ ...person, first_name: e.target.value })}
                        />
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
                                onChange={e => setPerson({ ...person, email: e.target.value })}
                            />
                        </FormGroup>

                        <FormGroup className="col-6">
                            <Label for="user">User account</Label>
                            <Input id="user" name="user" type="text"
                                value={person?.user?.name}
                                onChange={e => setPerson({ ...person, user: e.target.value })}
                            />
                        </FormGroup>

                    </div>

                    <div className="d-flex justify-content-center">
                        <Button color="primary" onClick={onSaveForm}>Save</Button>
                    </div>
                </Form>
                <Toast title={id ? "Create new employee card failed" : "Update failed"} messages={messages} close={() => { setMessages([]) }} />
            </div>
        </>
    )
}