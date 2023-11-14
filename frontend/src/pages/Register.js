import { Col, Form, FormGroup, Input, Label } from "reactstrap"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import { useState } from "react"
import Toast from "../components/Toast"
import axios from "axios"

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [role, setRole] = useState();
    const [messages, setMessages] = useState([])

    const submit = async e => {
        e.preventDefault()
        const warnings = []
        if (!email) {
            warnings.push("Email not defined.")
        }
        if (password.localeCompare(repeatPassword)) {
            warnings.push("Passwords not equal.")
        }
        if (!role) {
            warnings.push("User role not defined.")
        }
        if (warnings.length) {
            setMessages(warnings)
            return false
        }
        const user = {
            email,
            password,
            role
        };
        const { data } = await axios.post('register', user, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        localStorage.clear()
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`
        window.location.href = '/'
    }
    return (
        <>
            <PageHeader text="User Registration" />
            <Form>
                <FormGroup row>
                    <Label lg={2} for="email">Email</Label>
                    <Col lg={6}>
                        <Input id="email" name="email" type="email" autoFocus
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label lg={2} for="password">Password</Label>
                    <Col lg={6}>
                        <Input id="password" name="password" type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label lg={2} for="password">Repeat password</Label>
                    <Col lg={6}>
                        <Input id="repeat-password" name="repeat-password" type="password"
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                        />
                    </Col>
                </FormGroup>

                <FormGroup row tag="fieldset" required>
                    <legend className="col-form-label col-lg-2">
                        User Role
                    </legend>
                    <Col lg={6}>
                        <FormGroup check>
                            <Input name="role" type="radio"
                                value="Employer"
                                checked={role === "Employer"}
                                onChange={e => setRole(e.target.value)}
                            />{' '}<Label check>Employer</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Input name="role" type="radio"
                                value="Employee"
                                checked={role === "Employee"}
                                onChange={e => setRole(e.target.value)}
                            />{' '}<Label check>Employee</Label>
                        </FormGroup>
                    </Col>
                </FormGroup>

                <Col lg={{ offset: 2, size: 6 }}>
                    <Button color="primary" onClick={submit}>Register</Button>
                </Col>
            </Form>
            <Toast messages={messages} />
        </>
    )
}