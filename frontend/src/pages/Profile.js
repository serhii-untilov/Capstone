import { useContext, useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Form } from "reactstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { getGroups } from "../services/dictService";
import { updateUser } from "../services/userService";
import { Toast } from "../components/Toast"
import { UserContext } from "../context/UserContext";

export default function Profile() {
    const userContext = useContext(UserContext)
    const [formData, setFormData] = useState({})
    const [validated, setValidated] = useState(false)
    const [messages, setMessages] = useState([])
    const [groups, setGroups] = useState([])

    useEffect(() => {
        const fetchGroups = async () => {
            const groups = await getGroups()
            setGroups(groups)
        }
        fetchGroups().catch(console.error)
    }, [])

    useEffect(() => {
        setFormData(userContext.user)
    }, [userContext])

    const validate = () => {
        setValidated(true)
        const warnings = []
        if (!formData?.username) warnings.push("User name not defined.")
        if (!formData?.first_name) warnings.push("First name not defined.")
        if (!formData?.last_name) warnings.push("Last name not defined.")
        if (!formData?.email) warnings.push("Email not defined.")
        if (!formData?.groups[0]) warnings.push("Role not defined.")
        if (warnings.length) {
            // setMessages(warnings)
            return false
        }
        return true
    }

    const onUpdateUser = () => {
        if (!validate()) return false
        setValidated(false)
        setMessages([])
        updateUser(formData)
            .then((updatedUser) => userContext.setUser(updatedUser))
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const getCombinedUserName = () => {
        return formData ? formData.first_name ? `${formData.first_name} ${formData.last_name}` :
            formData.last_name ? `${formData.last_name}` :
            formData.email ? formData.email : '' : ''
    }

    return (
        <>
            <div className="col-12 h-100 bg-light pt-4">
                {/* <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">User profile</p> */}
                <Form className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                    <PageHeader text="User profile" className="text-center" />
                    <p className="col-lg-12 col-sm-11 m-auto text-center my-0 pb-3">Updating personal user data and choosing a role</p>
                    <h4 className="text-center text-primary m-0 p-0">{getCombinedUserName()}</h4>

                    {/* <FormGroup>
                        <Label for="username">Login</Label>
                        <Input id="username" name="username" type="text"
                            value={formData?.username}
                            required
                            invalid={validated && !formData?.username}
                            valid={validated && formData?.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            Please provide a user's login.
                        </div>
                    </FormGroup> */}

                    <FormGroup>
                        <Label for="first_name">First name</Label>
                        <Input id="first_name" name="first_name" type="text"
                            value={formData?.first_name}
                            required
                            invalid={validated && !formData?.first_name}
                            valid={validated && formData?.first_name}
                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            Please provide a user's first name.
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <Label for="last_name">Last name</Label>
                        <Input id="last_name" name="last_name" type="text"
                            value={formData?.last_name}
                            required
                            invalid={validated && !formData?.last_name}
                            valid={validated && formData?.last_name}
                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            Please provide a user's last name.
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input id="email" name="email" type="text"
                            value={formData?.email}
                            required
                            invalid={validated && !formData?.email}
                            valid={validated && formData?.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            Please provide a user's email.
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <Label for="group">User role</Label>
                        <Input type="select" id="group" name="group" className="form-select"
                            default=""
                            required
                            invalid={validated && !(formData?.groups?.length ? formData.groups[0] : null)}
                            valid={validated && !!(formData?.groups?.length ? formData.groups[0] : null)}
                            value={formData?.groups?.length ? formData.groups[0] : ''}
                            onChange={e => setFormData({ ...formData, groups: [e.target.value] })}
                        >
                            <option value="" key="0" disabled hidden></option>
                            {groups ?
                                groups.map(group => {
                                    return <option key={group.id} value={group.id}>{group.name}</option>
                                })
                                : null}
                        </Input>
                        <div className="invalid-feedback">
                            Please define a user's role.
                        </div>
                    </FormGroup>

                    <div className="d-flex justify-content-center">
                        <Button color="primary" className="me-2" onClick={onUpdateUser}>Update</Button>
                    </div>
                </Form>
                <Toast title="Updating a user has failed"
                    messages={messages} close={() => { setMessages([]) }}
                />
            </div>
        </>
    )
}