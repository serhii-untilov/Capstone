import { useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { postCompany, updateCompany } from "../services/companyService";
import { Navigate, redirect } from "react-router-dom";
import Button from "../components/Button"
import { formatDate, monthBegin } from "../services/dateService";
import Toast from "../components/Toast"

export function CompanyForm(props) {
    const formType = props.company?.is_demo ? 'VIEW' : props.company?.id ? 'UPDATE' : 'CREATE'
    const [messages, setMessages] = useState([])
    const [name, setName] = useState(props.company?.name || '')
    const [taxId, setTaxId] = useState(props.company?.tax_id || '')
    const [dateFrom, setDateFrom] = useState(props.company?.id
        ? props.company.date_from || ''
        : formatDate(monthBegin(Date.now())))

    const validate = () => {
        const warnings = []
        if (!name) warnings.push("Company name not defined.")
        if (name.length && props.companies.find(o => o.name === name && o.id !== props.company.id)) warnings.push("The same company name already exists.")
        if (taxId.length && props.companies.find(o => o.tax_id === taxId && o.id !== props.company.id)) warnings.push("The same Tax ID already exists.")
        if (warnings.length) {
            setMessages(warnings)
            return false
        }
        return true
    }

    const submitNewCompany = async e => {
        e.preventDefault()
        if (!validate()) return false
        postCompany({ name, tax_id: taxId, date_from: dateFrom })
            .catch(e => { setMessages([e.message || 'Error.']) })
        redirect('/company')
    }

    const submitSelectCompany = async e => {
        e.preventDefault()
        // TODO
    }

    const submitUpdateCompany = () => {
        if (!validate()) return false
        updateCompany({ id: props.company.id, name, tax_id: taxId, date_from: dateFrom })
            .catch(e => {setMessages([e.message || 'Error.'])})
    }

    return (
        <>
            <span className="col-lg-4 col-sm-11 m-auto">
                <Form className="shadow-sm border border-light-subtle m-3 p-3 rounded-4 bg-white" key={props.index}>
                    <h4 className="text-center text-primary p-2">{formType === 'CREATE' ? name ? name : "New Company" : name}</h4>
                    <FormGroup>
                        <Label for="name">Company name</Label>
                        <Input id="name" name="name" type="text"
                            value={name}
                            required
                            onChange={e => setName(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="tax_id">Tax ID</Label>
                        <Input id="tax_id" name="tax_id" type="text"
                            value={taxId}
                            onChange={e => setTaxId(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="date_from">Activity begin</Label>
                        <Input id="date_from" name="date_from" type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                    </FormGroup>

                    <div className="d-flex justify-content-center">
                        {formType === 'CREATE'
                            ? <Button color="primary" onClick={submitNewCompany}>Create</Button>
                            : formType === 'UPDATE'
                                ? <Button color="primary" onClick={submitUpdateCompany}>Update</Button>
                                : <Button color="primary" onClick={submitSelectCompany}>Select</Button>
                        }
                    </div>
                </Form>
                <Toast title={formType === 'CREATE'
                    ? "Creating a company has failed"
                    : "Updating a company has failed"}
                    messages={messages} close={() => { setMessages([]) }}
                />
            </span>
        </>
    )
}