import { Form, FormGroup, Input, Label } from "reactstrap"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import Button from "../components/Button"
import PageHeader from "../components/PageHeader"
import { Toast } from "../components/Toast"
import { register } from "../services/authService";
import { getGroups } from "../services/dictService";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userGroup, setUserGroup] = useState();
    const [groups, setGroups] = useState([])
    const [validated, setValidated] = useState(false)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchGroups = async () => {
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('access_token')
            setGroups(await getGroups())
        }
        fetchGroups().catch(console.error)
    }, [])

    const validate = () => {
        setValidated(true)
        if (!email) return false
        if (!userGroup) return false
        return true
    }

    const submit = async e => {
        e.preventDefault()
        if (!validate()) return false
        try {
            const isAuth = register({ email, password, group_id: userGroup })
            authContext.setIsAuth(isAuth)
            if (isAuth) return navigate('/', { replace: true })
            setMessages([...messages, "Registration failed."])
        } catch (error) {
            setMessages([error.message || 'Error'])
        }
    }

    return (
        <>
            <div className="col-12 h-100 bg-light pt-4">
                <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                    <PageHeader text="Register" className="col-lg-4 col-sm-11 m-auto text-center" />
                    <p className="col-lg-12 col-sm-11 m-auto text-center p-3">Please fill in this form to create a user account</p>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input id="email" name="email" type="email" autoFocus
                            required
                            value={email}
                            invalid={validated && !email}
                            valid={validated && email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className="invalid-feedback">
                            Enter your email.
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input id="password" name="password" type="password"
                            required
                            value={password}
                            invalid={validated && !password}
                            valid={validated && password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="invalid-feedback">
                            Enter password.
                        </div>
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <Label for="group">User role</Label>
                        <Input type="select" id="group" name="group" className="form-select"
                            required
                            defaultValue=""
                            onChange={e => setUserGroup(e.target.value)}
                            invalid={validated && !userGroup}
                            valid={validated && userGroup}
                        >
                            <option value="" key="0" disabled hidden></option>
                            {groups
                                ? groups.map(group => {
                                    return <option key={group.id} value={group.id}>{group.name}</option>
                                })
                                : null
                            }
                        </Input>
                        <div className="invalid-feedback">Define user group.</div>
                    </FormGroup>

                    <div className="d-flex justify-content-center">
                        <Button color="primary" onClick={submit}>Register</Button>
                    </div>
                </Form>
                <Toast title="Registration failed" messages={messages} close={() => { setMessages([]) }} />
            </div>
        </>
    )
}