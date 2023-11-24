import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { CompanyContext } from "../context/CompanyContext";
import { dateToTime, formatDate, monthBegin } from "../services/dateService";
import { getCompanies, getCompany, postCompany, updateCompany } from "../services/companyService";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Toast from "../components/Toast"
import { UserContext } from "../context/UserContext";
import { getAccountingList, getLawList } from "../services/dictService";

export default function Company() {
    const { id } = useParams()
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const [formData, setFormData] = useState({})
    const [companyList, setCompanyList] = useState([])
    const [lawList, setLawList] = useState([])
    const [accountingList, setAccountingList] = useState([])
    const [validated, setValidated] = useState(false)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLawList(await getLawList())
            setAccountingList(await getAccountingList())
            setCompanyList(await getCompanies())
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const company = id ? await getCompany(id) : {
                name: '',
                law: lawList.length ? lawList[0] : '',
                tax_id: '',
                accounting: accountingList.length ? accountingList[0] : '',
                date_from: formatDate(monthBegin(Date.now()))
            }
            setFormData(company)
            if (id) {
                companyContext.setCompany(company)
            }
            setValidated(false)
            setMessages([])
        }
        fetchData()

    }, [id, accountingList, lawList])

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
        if (!formData?.name) warnings.push("Company name not defined.")
        if (!formData?.id && formData?.name.length && companyList.find(o => o.name === formData?.name)) warnings.push("The same company name already exists.")
        if (!formData?.law) warnings.push("Laws not defined.")
        if (formData?.tax_id.length && companyList.find(o => o.tax_id === formData?.tax_id && o.id !== formData?.id)) warnings.push("The same Tax ID already exists.")
        if (!formData?.accounting) warnings.push("Accounting type not defined.")
        if (!formData?.id) {
            const companiesCount = companyList.filter(o => o.owner === userContext.user.id && isCompanyActual(o)).length
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
        postCompany({ name: formData?.name, law: formData?.name, tax_id: formData?.tax_id, accounting: formData?.accounting, date_from: formData?.date_from })
            .then(newCompany => {
                setCompanyList([...companyList, newCompany])
                companyContext.setCompany(newCompany)
                setFormData(newCompany)
            })
            .catch(e => {
                setMessages([e.message || 'Error.'])
            })
    }

    const onDeleteCompany = async e => {
        e.preventDefault()
        updateCompany({ id: formData?.id, deleted: formatDate(monthBegin(Date.now())) })
            .then(deletedCompany => {
                setCompanyList([...companyList, deletedCompany])
                companyContext.setCompany(null)
                setFormData(deletedCompany)
            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onRestoreCompany = async e => {
        e.preventDefault()
        updateCompany({ id: formData?.id, deleted: '9999-12-31' })
            .then(restoredCompany => {
                setCompanyList([...companyList, restoredCompany])
                companyContext.setCompany(restoredCompany)
                setFormData(restoredCompany)
            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onUpdateCompany = () => {
        if (!validate()) return false
        updateCompany({ id: formData?.id, name: formData?.name, law: formData?.law, tax_id: formData?.tax_id, accounting: formData?.accounting, date_from: formData?.date_from })
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
                {isCompanyDeleted(formData)
                    ? "Restore deleted company"
                    : formData?.id && !formData?.is_demo
                        ? "Selected company for payroll processing"
                        : formData?.is_demo
                            ? "Selected company for a payroll processing demo"
                            : "Please fill in this form to create new company"}
            </p>
            <Form className="col-lg-4 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-4 m-auto bg-white">
                <h4 className="text-center text-primary p-2">{!formData?.id ? formData?.name ? formData?.name : "New Company" : formData?.name}</h4>

                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input id="name" name="name" type="text"
                        value={formData?.name}
                        required
                        invalid={validated && !formData?.name}
                        valid={validated && formData?.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div class="invalid-feedback">
                        Please provide a company name.
                    </div>
                </FormGroup>

                <div className="row">
                    <FormGroup className="mb-3 col-6">
                        <Label for="law">Laws on wages and taxes</Label>
                        <Input type="select" id="law" name="law" className="form-select"
                            default=""
                            required
                            invalid={validated && !formData?.law}
                            valid={validated && formData?.law}
                            value={formData?.law}
                            onChange={e => setFormData({ ...formData, law: e.target.value })}
                        >
                            <option value="" key="0" disabled hidden></option>
                            {lawList.map(law => {
                                return <option key={law.id} value={law.id}>{law.name}</option>
                            })}
                        </Input>
                        <div class="invalid-feedback">
                            Please define laws.
                        </div>
                    </FormGroup>

                    <FormGroup className="mb-3 col-6">
                        <Label for="tax_id">Tax ID</Label>
                        <Input id="tax_id" name="tax_id" type="text"
                            value={formData?.tax_id}
                            onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                        />
                    </FormGroup>

                </div>

                <div className="row">
                    <FormGroup className="mb-3 col-6">
                        <Label for="accounting">Accounting type</Label>
                        <Input type="select" id="accounting" name="accounting" className="form-select"
                            default=""
                            required
                            invalid={validated && !formData?.accounting}
                            valid={validated && formData?.accounting}
                            value={formData?.accounting}
                            onChange={e => setFormData({ ...formData, accounting: e.target.value })}
                        >
                            <option value="" key="0" disabled hidden></option>
                            {accountingList.map(accounting => {
                                return <option key={accounting.id} value={accounting.id}>{accounting.name}</option>
                            })}
                        </Input>
                        <div class="invalid-feedback">
                            Please define an accounting type.
                        </div>
                    </FormGroup>
                    <FormGroup className="mb-3 col-6">
                        <Label for="date_from">Activity begin</Label>
                        <Input id="date_from" name="date_from" type="date"
                            value={formData?.date_from}
                            onChange={e => setFormData({ ...formData, date_from: e.target.value })}
                        />
                    </FormGroup>
                </div>

                <div className="d-flex justify-content-center">
                    {!formData?.id ?
                        <Button color="primary" onClick={onCreateCompany}>Create</Button>
                        : null}
                    {!formData?.is_demo && formData?.id && formData?.deleted && dateToTime(formData?.deleted) <= dateToTime(Date.now()) ?
                        <Button color="primary" onClick={onRestoreCompany}>Restore</Button>
                        : null}
                    {formData?.id && !formData?.is_demo && (!formData?.deleted || dateToTime(formData?.deleted) > dateToTime(Date.now())) ?
                        <>
                            <Button color="primary" className="me-2" onClick={onUpdateCompany}>Update</Button>
                            <Button color="light" className="me-2 btn-link danger" outline onClick={onDeleteCompany}>Delete</Button>
                        </> : null}
                    {formData?.is_demo ?
                        <Button color="primary" onClick={onSelectCompany}>Demo</Button>
                        : null}
                </div>
            </Form>
            <Toast title={!formData?.id
                ? "Creating a company has failed"
                : formData?.is_demo
                    ? "Demo company"
                    : "Updating a company has failed"}
                messages={messages} close={() => { setMessages([]) }}
            />
        </>
    )
}