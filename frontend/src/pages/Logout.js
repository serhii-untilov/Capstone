import { Form } from "reactstrap"
import { useNavigate } from "react-router-dom"

import Button from "../components/Button"
import PageHeader from "../components/PageHeader"
import { logout } from "../services/userService"


export default function Logout() {
    const navigate = useNavigate()

    const submit = async e => {
        e.preventDefault()
        await logout()
        navigate('/', { replace: true })
    }

    return (
        <>
            <PageHeader text="Logout" className="col-lg-5 col-sm-11 m-auto text-center" />
            <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">Are you sure you want to log out?</p>
            <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-4 m-auto bg-white">
                <div className="d-flex justify-content-center">
                    <Button color="primary" onClick={submit}>Logout</Button>
                </div>
            </Form>
        </>
    )
}
