import { Form, FormGroup, Input, Label } from "reactstrap"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import Toast from "../components/Toast"
import axios from "axios"

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messages, setMessages] = useState([])

    const validate = () => {
        const messages = []
        if (!email) {
            messages.push("Email not defined.")
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
        const user = { email, password };
        const { data } = await axios.post('login', user, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        localStorage.clear()
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`
        window.location.href = '/'
    }

    return (
        <>
            <PageHeader text="Login" className="col-lg-5 col-sm-11 m-auto text-center" />
            <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">Please fill in this form to login registered user</p>
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

                <div className="d-flex justify-content-center">
                    <Button color="primary" onClick={submit}>Login</Button>
                </div>
            </Form>
            <Toast title="Login is not possible" messages={messages} close={() => { setMessages([]) }} />
        </>
    )
}
