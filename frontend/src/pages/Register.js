import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap"
import PageHeader from "../components/PageHeader"

export default function Register() {
    return (
        <>
            <PageHeader text="User Register" />
            <Form>
                <FormGroup row>
                    <Label lg={2} for="email">Email</Label>
                    <Col lg={6}>
                        <Input id="email" name="email" type="email" autoFocus />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label lg={2} for="password">Password</Label>
                    <Col lg={6}>
                        <Input id="password" name="password" type="password" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label lg={2} for="password">Repeat password</Label>
                    <Col lg={6}>
                        <Input id="repeat-password" name="repeat-password" type="password" />
                    </Col>
                </FormGroup>

                <FormGroup row tag="fieldset" required>
                    <legend className="col-form-label col-lg-2">
                        User Role
                    </legend>
                    <Col lg={6}>
                        <FormGroup check>
                            <Input name="employer" type="radio" />{' '}<Label check>Employer</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Input name="employee" type="radio" />{' '}<Label check>Employee</Label>
                        </FormGroup>
                    </Col>
                </FormGroup>

                <Col lg={{offset: 2,size: 6}}>
                    <Button color="primary">Register</Button>
                </Col>

            </Form>
        </>
    )
}