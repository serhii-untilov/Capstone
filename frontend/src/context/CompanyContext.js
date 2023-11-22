import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCompanies, getCompany } from '../services/companyService';
import { AuthContext } from './AuthContext';

const CompanyContext = createContext()

const CompanyProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
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
            } else {
                setCompany(null)
            }
        }
        const company_id = localStorage.getItem('company_id')
        if (authContext.isAuth) {
            fetchData(company_id).catch(console.error)
        } else {
            setCompany(null)
        }
    }, [authContext])

    return <CompanyContext.Provider value={{ company, setCompany }}>{children}</CompanyContext.Provider>
}

export { CompanyContext, CompanyProvider }