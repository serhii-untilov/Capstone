import { useContext, useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import { getCompanies, newCompany } from "../services/companyService"
import { CompanyContext } from "../context/CompanyContext"
import { CompanyForm } from "../components/CompanyForm"
import { AuthContext } from "../context/AuthContext"
import { UserContext } from "../context/UserContext"

export default function Company() {
    const authContext = useContext(AuthContext)
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const [companies, setCompanies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const companies = await getCompanies() || []
            companies.push(newCompany)
            setCompanies(companies)
        }
        if (authContext.isAuth) {
            fetchData().catch(console.error)
        }
    }, [authContext, userContext])

    return (
        <>
            {!authContext.isAuth ? null :
                <div className="h-100 overflow-auto">
                    <PageHeader text="Company" />
                    <p className="col-lg-4 col-sm-11 m-auto text-center pb-3">
                        {companyContext.company
                            ? 'Select the company to payroll, view a demo or create a new company'
                            : 'Please fill in this form to create a company'
                        }
                    </p>
                    <div className="row justify-content-center">
                        {companies.map((company, i) => {
                            return <CompanyForm company={company} companies={companies} index={i} />
                        })}
                    </div>
                </div>
            }
        </>
    )
}