import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext';
import { getCompanies, getCompany } from '../services/companyService';

const CompanyContext = createContext()

const CompanyProvider = ({ children }) => {
    const userContext = useContext(UserContext);
    const [company, setCompany] = useState()

    useEffect(() => {
        const fetchData = async (companyId) => {
            let company = companyId ? await getCompany(company_id) : null
            if (!company) {
                const companies = await getCompanies() || []
                company = companies.length ? companies[0] : null
            }
            if (company) {
                setCompany(company)
                localStorage.setItem('company_id', company.id)
            }
        }
        const company_id = localStorage.getItem('company_id')
        if (company_id) {
            fetchData(userContext.user.id, company_id).catch(console.error)
        } else {
            setCompany(null)
        }
    }, [userContext])

    return <CompanyContext.Provider value={{ company, setCompany }}>{children}</CompanyContext.Provider>
}

export { CompanyContext, CompanyProvider }