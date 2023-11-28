import { Form, FormGroup, Input, Label } from "reactstrap"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"

import Button from "../components/Button"
import PageHeader from "../components/PageHeader"
import { Toast } from "../components/Toast"
import { login } from "../services/authService"
import { AuthContext } from "../context/AuthContext"

export default function Login() {
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false)
    const [messages, setMessages] = useState([])

    const validate = () => {
        setValidated(true)
        if (!email) return false
        if (!password) return false
        return true
    }

    const submit = async e => {
        e.preventDefault()
        if (!validate()) return false
        try {
            const isAuth = await login({ username: email, email, password })
            authContext.setIsAuth(isAuth)
            if (isAuth) return navigate('/', { replace: true })
            setMessages(["Login failed."])
        } catch (error) {
            setMessages([error.message || 'Error'])
        }
    }

    authContext.setIsAuth(false)

    return (
        <>
            <div className="col-12 h-100 bg-light pt-4">
                <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                    <PageHeader text="Login" className="col-lg-4 col-sm-11 m-auto text-center" />
                    <p className="col-lg-12 col-sm-11 m-auto text-center p-3">Please fill in this form to login registered user</p>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input id="email" name="email" type="email" autoFocus
                            // className="fw-bolder"
                            required
                            invalid={validated && !email}
                            valid={validated && email}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className="invalid-feedback">
                            Enter your email.
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input id="password" name="password" type="password"
                            value={password}
                            invalid={validated && !password}
                            valid={validated && password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="invalid-feedback">
                            Enter password.
                        </div>
                    </FormGroup>

                    <div className="d-flex justify-content-center">
                        <Button color="primary" onClick={submit}>Login</Button>
                    </div>
                </Form>
                <Toast title="Login failed" messages={messages} close={() => { setMessages([]) }} />
            </div>
        </>
    )
}
