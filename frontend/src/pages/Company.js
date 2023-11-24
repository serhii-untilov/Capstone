import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { CompanyContext } from "../context/CompanyContext";
import { dateToTime, formatDate, monthBegin } from "../services/dateService";
import { getCompanies, getCompany, newCompany, postCompany, updateCompany } from "../services/companyService";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast"
import { UserContext } from "../context/UserContext";
import { getAccountingList, getLawsList } from "../services/dictService";

export default function Company() {
    const { id } = useParams()
    const authContext = useContext(AuthContext)
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const [company, setCompany] = useState(newCompany)
    const [companies, setCompanies] = useState([])
    const [messages, setMessages] = useState([])
    const [name, setName] = useState()
    const [lawsList, setLawsList] = useState([])
    const [laws, setLaws] = useState()
    const [taxId, setTaxId] = useState()
    const [accountingList, setAccountingList] = useState([])
    const [accounting, setAccounting] = useState()
    const [dateFrom, setDateFrom] = useState()
    const [validated, setValidated] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                if (!id.localeCompare('new')) {
                    setCompany(newCompany)
                } else {
                    const company = await getCompany(id)
                    if (isCompanyActual(company)) {
                        companyContext.setCompany(company)
                    }
                    setCompany(company)
                }
            }
            const lawsList = await getLawsList()
            setLawsList(lawsList)
            const accountingList = await getAccountingList()
            setAccountingList(accountingList)
            setCompanies(await getCompanies())
            setName(company?.name)
            setLaws(company?.id ? company?.laws : lawsList[0]?.id.toString())
            setTaxId(company?.tax_id)
            setAccounting(company?.id ? company?.accounting : accountingList[0]?.id.toString())
            setDateFrom(company?.id ? company?.dateFrom : formatDate(monthBegin(Date.now())))
            setValidated(false)
        }
        if (authContext.isAuth) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authContext, company?.name, id])

    function isCompanyActual(company) {
        if (!company) return false
        const today = dateToTime(Date.now())
        if (company.deleted && dateToTime(company.deleted) <= today) return false
        if (company.date_from && dateToTime(company.date_from) > today) return false
        if (company.date_to && dateToTime(company.date_to) < today) return false
        return true
    }

    function isCompanyDeleted(company) {
        if (!company) return false
        const today = dateToTime(Date.now())
        if (company.deleted && dateToTime(company.deleted) <= today) return true
        return false
    }

    const validate = () => {
        setValidated(true)
        const warnings = []
        if (!name) warnings.push("Company name not defined.")
        if (!company.id && name.length && companies.find(o => o.name === name)) warnings.push("The same company name already exists.")
        if (!laws) warnings.push("Laws not defined.")
        if (taxId.length && companies.find(o => o.tax_id === taxId && o.id !== company.id)) warnings.push("The same Tax ID already exists.")
        if (!accounting) warnings.push("Accounting type not defined.")
        if (!company.id) {
            const companiesCount = companies.filter(o => o.owner === userContext.user.id && isCompanyActual(o)).length
            if (companiesCount >= 2) warnings.push("The user has 2 companies. For more, you can upgrade your plan to Premium.")
        }
        if (warnings.length) {
            setMessages(warnings)
            return false
        }
        return true
    }

    const onCreateCompany = async e => {
        e.preventDefault()
        if (!validate()) return false
        postCompany({ name, laws, tax_id: taxId, accounting, date_from: dateFrom })
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
        updateCompany({ id: company.id, deleted: formatDate(monthBegin(Date.now())) })
            .then(deletedCompany => {
                setCompanies([...companies, deletedCompany])
                companyContext.setCompany(null)
                setCompany(deletedCompany)
            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onRestoreCompany = async e => {
        e.preventDefault()
        updateCompany({ id: company.id, deleted: '9999-12-31' })
            .then(restoredCompany => {
                setCompanies([...companies, restoredCompany])
                companyContext.setCompany(restoredCompany)
                setCompany(restoredCompany)
            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onUpdateCompany = () => {
        if (!validate()) return false
        updateCompany({ id: company.id, name, laws, tax_id: taxId, accounting, date_from: dateFrom })
            .then(updatedCompany => {
                if (isCompanyActual(updatedCompany)) {
                    companyContext.setCompany(updatedCompany)
                }
            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onSelectCompany = async e => {
        e.preventDefault()
        setMessages(["Demo company selected. Just try it for payroll."])
    }

    return (
        <>
            <PageHeader text="Company" className="col-lg-5 col-sm-11 m-auto text-center" />
            <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">
                {isCompanyDeleted(company)
                    ? "Restore deleted company"
                    : company?.id && !company?.is_demo
                        ? "Selected company for payroll processing"
                        : company?.is_demo
                            ? "Selected company for a payroll processing demo"
                            : "Please fill in this form to create new company"}
            </p>
            <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-4 m-auto bg-white">
                <h4 className="text-center text-primary p-2">{!company.id ? name ? name : "New Company" : name}</h4>

                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input id="name" name="name" type="text"
                        // className="fw-bolder"
                        value={name}
                        required
                        invalid={validated && !name}
                        valid={validated && name}
                        onChange={e => setName(e.target.value)}
                    />
                    <div class="invalid-feedback">
                        Please provide a company name.
                    </div>
                </FormGroup>

                <div className="row">
                    <FormGroup className="mb-3 col-6">
                        <Label for="laws">Laws on wages and taxes</Label>
                        <select id="laws" name="laws" className="form-select"
                            required
                            invalid={validated && !laws}
                            valid={validated && laws}
                            onChange={e => setLaws(e.target.value)}
                        >
                            <option value="" key="0" disabled hidden></option>
                            {lawsList.map(laws => {
                                return <option key={laws.id} value={laws.id}>{laws.name}</option>
                            })}
                        </select>
                        <div class="invalid-feedback">
                            Please define laws.
                        </div>
                    </FormGroup>

                    <FormGroup className="mb-3 col-6">
                        <Label for="tax_id">Tax ID</Label>
                        <Input id="tax_id" name="tax_id" type="text"
                            value={taxId}
                            onChange={e => setTaxId(e.target.value)}
                        />
                    </FormGroup>

                </div>

                <div className="row">
                    <FormGroup className="mb-3 col-6">
                        <Label for="accounting">Accounting type</Label>
                        <select id="accounting" name="accounting" className="form-select"
                            required
                            invalid={validated && !accounting}
                            valid={validated && accounting}
                            onChange={e => setAccounting(e.target.value)}
                        >
                            <option value="" key="0" disabled hidden></option>
                            {accountingList.map(accounting => {
                                return <option key={accounting.id} value={accounting.id}>{accounting.name}</option>
                            })}
                        </select>
                        <div class="invalid-feedback">
                            Please define an accounting type.
                        </div>
                    </FormGroup>
                    <FormGroup className="mb-3 col-6">
                        <Label for="date_from">Activity begin</Label>
                        <Input id="date_from" name="date_from" type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                    </FormGroup>
                </div>

                <div className="d-flex justify-content-center">
                    {!company.id ?
                        <Button color="primary" onClick={onCreateCompany}>Create</Button>
                        : null}
                    {!company.is_demo && company.id && company.deleted && dateToTime(company.deleted) <= dateToTime(Date.now()) ?
                        <Button color="primary" onClick={onRestoreCompany}>Restore</Button>
                        : null}
                    {company.id && !company.is_demo && (!company.deleted || dateToTime(company.deleted) > dateToTime(Date.now())) ?
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
                : company.is_demo
                    ? "Demo company"
                    : "Updating a company has failed"}
                messages={messages} close={() => { setMessages([]) }}
            />
        </>
    )
}