import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { CompanyContext } from "../context/CompanyContext";
import { dateToTime, formatDate, monthBegin, monthEnd } from "../services/dateService";
import { getCompanies, getCompany, postCompany, updateCompany } from "../services/companyService";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { Toast } from "../components/Toast"
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
                law: lawList.length ? lawList[0].id : '',
                tax_id: '',
                accounting: accountingList.length ? accountingList[0].id : '',
                date_from: formatDate(monthBegin(Date.now())),
                pay_period: formatDate(monthBegin(Date.now())),
                check_date: formatDate(monthEnd(Date.now())),
            }
            setFormData(company)
            if (id) {
                companyContext.setCompany(company)
                localStorage.setItem('company_id', id)
            }
            setValidated(false)
            setMessages([])
        }
        fetchData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            // setMessages(warnings)
            return false
        }
        return true
    }

    const onCreateCompany = async e => {
        e.preventDefault()
        if (!validate()) return false
        setValidated(false)
        setMessages([])
        postCompany({ ...formData })
            .then(newCompany => {
                setCompanyList([...companyList, newCompany])
                companyContext.setCompany(newCompany)
                setFormData(newCompany)
                localStorage.setItem('company_id', newCompany.id)
            })
            .catch(e => {
                setMessages([e.message || 'Error.'])
            })
    }

    const onDeleteCompany = async e => {
        e.preventDefault()
        setValidated(false)
        setMessages([])
        updateCompany({ id: formData?.id, deleted: formatDate(monthBegin(Date.now())) })
            .then(deletedCompany => {
                setCompanyList([...companyList, deletedCompany])
                companyContext.setCompany(null)
                setFormData(deletedCompany)
                localStorage.removeItem('company_id')

            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onRestoreCompany = async e => {
        e.preventDefault()
        setValidated(false)
        setMessages([])
        updateCompany({ id: formData?.id, deleted: '9999-12-31' })
            .then(restoredCompany => {
                setCompanyList([...companyList, restoredCompany])
                companyContext.setCompany(restoredCompany)
                setFormData(restoredCompany)
                localStorage.setItem('company_id', restoredCompany.id)
            })
            .catch(e => { setMessages([e.message || 'Error.']) })
    }

    const onUpdateCompany = () => {
        if (!validate()) return false
        setValidated(false)
        setMessages([])
        updateCompany({ ...formData })
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
        setValidated(false)
    }

    return (
        <>
            <div className="col-12 h-100 bg-light pt-4">

                <Form className="col-lg-6 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                    <PageHeader text="Company" className="text-center p-0 m-0" />
                    <p className="col-lg-12 col-sm-11 m-auto text-center my-0 pb-3">
                        {isCompanyDeleted(formData)
                            ? "Restore deleted company"
                            : formData?.id && !formData?.is_demo
                                ? "Selected company for payroll processing"
                                : formData?.is_demo
                                    ? "Selected company for a payroll processing demo"
                                    : "Please fill in this form to create new company"}
                    </p>
                    <h4 className="text-center text-primary m-0 p-0">{!formData?.id ? formData?.name ? formData?.name : "New Company" : formData?.name}</h4>

                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input id="name" name="name" type="text"
                            value={formData?.name}
                            required
                            invalid={validated && !formData?.name}
                            valid={validated && formData?.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <div className="invalid-feedback">
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
                                {lawList ? lawList.map(law => {
                                    return <option key={law.id} value={law.id}>{law.name}</option>
                                }) : null}
                            </Input>
                            <div className="invalid-feedback">
                                Please define laws.
                            </div>
                        </FormGroup>

                        <FormGroup className="mb-3 col-6">
                            <Label for="tax_id">Tax ID</Label>
                            <Input id="tax_id" name="tax_id" type="text"
                                value={formData?.tax_id}
                                valid={validated}
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
                                {accountingList ? accountingList.map(accounting => {
                                    return <option key={accounting.id} value={accounting.id}>{accounting.name}</option>
                                }) : null}
                            </Input>
                            <div className="invalid-feedback">
                                Please define an accounting type.
                            </div>
                        </FormGroup>
                        <FormGroup className="mb-3 col-6">
                            <Label for="date_from">Activity begin</Label>
                            <Input id="date_from" name="date_from" type="date"
                                value={formData?.date_from}
                                invalid={validated && !formData?.date_from}
                                valid={validated && formData?.date_from}
                                onChange={e => {
                                    const date_from = formatDate(e.target.value)
                                    const pay_period = dateToTime(date_from) > dateToTime(formData.pay_period) ? date_from :
                                        dateToTime(monthEnd(date_from)) < dateToTime(formData.pay_period) ? date_from : formData.pay_period
                                    const check_date = dateToTime(date_from) > dateToTime(formData.check_date) ? formatDate(monthEnd(date_from)) :
                                        dateToTime(monthEnd(date_from)) < dateToTime(formData.pay_period) ? formatDate(monthEnd(date_from)) : formData.check_date

                                    setFormData({
                                        ...formData,
                                        date_from,
                                        pay_period,
                                        check_date
                                    })
                                }
                                }
                            />
                            <div className="invalid-feedback">
                                Please provide date of activity begin.
                            </div>
                        </FormGroup>
                    </div>

                    <div className="row">
                        <FormGroup className="mb-3 col-6">
                            <Label for="pay_period">Current pay period</Label>
                            <Input id="pay_period" name="pay_period" type="date"
                                value={formData?.pay_period}
                                invalid={validated && !formData?.pay_period}
                                valid={validated && formData?.pay_period}
                                onChange={e => {
                                    let pay_period = formatDate(monthBegin(e.target.value))
                                    const date_from = formatDate(monthBegin(formData.date_from))
                                    if (dateToTime(pay_period) < dateToTime(date_from)) {
                                        pay_period = date_from
                                    }
                                    let check_date = formatDate(formData.check_date)
                                    if (dateToTime(check_date) < dateToTime(pay_period)) {
                                        check_date = formatDate(monthEnd(pay_period))
                                    }
                                    setFormData({
                                        ...formData,
                                        pay_period,
                                        check_date
                                    })
                                }}
                            />
                            <small id="emailHelp" class="form-text text-muted">The time frame in which your employee worked.</small>
                            <div className="invalid-feedback">
                                Please provide pay period.
                            </div>
                        </FormGroup>
                        <FormGroup className="mb-3 col-6">
                            <Label for="check_date">Next check date</Label>
                            <Input id="check_date" name="check_date" type="date"
                                value={formData?.check_date}
                                invalid={validated && !formData?.check_date}
                                valid={validated && formData?.check_date}
                                onChange={e => {
                                    const pay_period = formatDate(formData.pay_period)
                                    let check_date = formatDate(e.target.value)
                                    if (dateToTime(check_date) < dateToTime(pay_period))
                                        check_date = formatDate(monthEnd(pay_period))
                                    setFormData({
                                        ...formData,
                                        check_date
                                    })
                                }
                                }
                            />
                            <small id="emailHelp" class="form-text text-muted">The date that the paycheck will be made.</small>
                            <div className="invalid-feedback">
                                Please provide the next check date.
                            </div>
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
            </div>
        </>
    )
}