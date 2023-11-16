import { Form } from "reactstrap"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

import Button from "../components/Button"
import PageHeader from "../components/PageHeader"


export default function Logout() {
    const history = useHistory();

    const submit = async e => {
        e.preventDefault()
        localStorage.clear()
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        history.length = 0
        history.push('/')
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
