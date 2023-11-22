import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { CompanyContext } from "../context/CompanyContext";
import { formatDate, monthBegin } from "../services/dateService";
import { getCompanies, getCompany, newCompany, postCompany, updateCompany } from "../services/companyService";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast"
import { UserContext } from "../context/UserContext";

export default function Company() {
    const { companyId } = useParams()
    const authContext = useContext(AuthContext)
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const [company, setCompany] = useState(newCompany)
    const [companies, setCompanies] = useState([])
    const [messages, setMessages] = useState([])
    const [name, setName] = useState()
    const [taxId, setTaxId] = useState()
    const [dateFrom, setDateFrom] = useState()

    useEffect(() => {
        const fetchData = async () => {
            if (companyId) {
                if (!companyId.localeCompare('new')) {
                    setCompany(newCompany)
                } else {
                    const company = await getCompany(companyId)
                    companyContext.setCompany(company)
                    setCompany(company)
                }
            }
            setName(company?.name)
            setTaxId(company?.tax_id)
            setDateFrom(company?.id ? company?.dateFrom : formatDate(monthBegin(Date.now())))
            setCompanies(await getCompanies())
        }
        if (authContext.isAuth) {
            fetchData()
        }
    }, [authContext, company.dateFrom, company.name, company.tax_id, companyId])

    const validate = () => {
        const warnings = []
        if (!name) warnings.push("Company name not defined.")
        if (name.length && companies.find(o => o.name === name && o.id !== company.id)) warnings.push("The same company name already exists.")
        if (taxId.length && companies.find(o => o.tax_id === taxId && o.id !== company.id)) warnings.push("The same Tax ID already exists.")
        const companiesCount = companies.filter(o => o.owner.id === userContext.user.id).length
        if (companiesCount > 5) warnings.push("The user has 5 companies. For more, you can upgrade your plan to Premium.")
        if (warnings.length) {
            setMessages(warnings)
            return false
        }
        return true
    }

    const onCreateCompany = async e => {
        e.preventDefault()
        if (!validate()) return false
        postCompany({ name, tax_id: taxId, date_from: dateFrom })
            .then(newCompany => {
                setCompanies([...companies, newCompany])
                companyContext.setCompany(newCompany)
                setCompany(newCompany)
            })
            .catch(e => {
                setMessages([e.message || 'Error.'])
            })
    }

    const onDeleteCompany = async e => {
        e.preventDefault()
        // TODO
    }

    const onUpdateCompany = () => {
        if (!validate()) return false
        updateCompany({ id: company.id, name, tax_id: taxId, date_from: dateFrom })
            .then(updatedCompany => {companyContext.setCompany(updatedCompany)})
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onSelectCompany = async e => {
        e.preventDefault()
        // TODO
    }

    return (
        <>
            <PageHeader text="Company" className="col-lg-5 col-sm-11 m-auto text-center" />
            <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">
                {company?.id && !company?.is_demo
                    ? "Selected company for payroll processing"
                    : company?.is_demo
                        ? "Selected company for a payroll processing demo"
                        : "Please fill in this form to create new company"}
                </p>
            <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-4 m-auto bg-white">
                <h4 className="text-center text-primary p-2">{!company.id ? name ? name : "New Company" : name}</h4>
                {/* {formDescription ?
                    <p className="m-auto text-center pt-0 pb-3">{formDescription}</p>
                    : null } */}
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input id="name" name="name" type="text" autoFocus
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
                    {!company.id ?
                        <Button color="primary" onClick={onCreateCompany}>Create</Button>
                        : null}
                    {company.id && !company.is_demo ?
                        <>
                            <Button color="primary" className="me-2" onClick={onUpdateCompany}>Update</Button>
                            <Button color="light" className="me-2 btn-link danger" outline onClick={onDeleteCompany}>Delete</Button>
                        </> : null}
                    {company.is_demo ?
                        <Button color="primary" onClick={onSelectCompany}>Demo</Button>
                        : null}
                </div>
            </Form>
            <Toast title={!company.id
                ? "Creating a company has failed"
                : "Updating a company has failed"}
                messages={messages} close={() => { setMessages([]) }}
            />
        </>
    )
}