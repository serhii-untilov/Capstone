import { Form, FormGroup, Input, Label } from "reactstrap"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import Button from "../components/Button"
import PageHeader from "../components/PageHeader"
import Toast from "../components/Toast"
import { register } from "../services/authService";
import { getGroups } from "../services/dictService";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [userGroup, setUserGroup] = useState();
    const [messages, setMessages] = useState([])
    const [groups, setGroups] = useState([])

    useEffect(() => {
        const fetchGroups = async () => {
            const groups = await getGroups()
            setGroups(groups)
        }
        fetchGroups().catch(console.error)
    }, [])

    const validate = () => {
        const messages = []
        if (!email) {
            messages.push("Email not defined.")
        }
        if (password.localeCompare(repeatPassword)) {
            messages.push("Passwords not equal.")
        }
        if (!userGroup) {
            messages.push("User group not defined.")
        }
        return messages
    }

    const submit = async e => {
        e.preventDefault()
        const messages = validate()
        if (messages.length) {
            setMessages(messages)
            return false
        }
        const token = await register({ email, password, group_id: userGroup })
        authContext.setIsAuth(!!token)
        navigate('/', { replace: true })
    }

    return (
        <>
            <PageHeader text="Register" className="col-lg-5 col-sm-11 m-auto text-center" />
            <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">Please fill in this form to create a user account</p>
            <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-4 m-auto bg-white">
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input id="email" name="email" type="email" autoFocus
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input id="password" name="password" type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="repeat-password">Repeat password</Label>
                    <Input id="repeat-password" name="repeat-password" type="password"
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
                    />
                </FormGroup>

                <FormGroup className="mb-3">
                    <Label for="group">User role</Label>
                    <select id="group" name="group" className="form-select"
                        defaultValue=""
                        onChange={e => setUserGroup(e.target.value)}
                    >
                        <option value="" key="0" disabled></option>
                        {groups.map(group => {
                            return <option key={group.id} value={group.id}>{group.name}</option>
                        })}
                    </select>
                </FormGroup>

                <div className="d-flex justify-content-center">
                    <Button color="primary" onClick={submit}>Register</Button>
                </div>
            </Form>
            <Toast title="Registration failed" messages={messages} close={() => { setMessages([]) }} />
        </>
    )
}