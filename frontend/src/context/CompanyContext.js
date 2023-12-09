import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCompanies, getCompany } from '../services/companyService';
import { AuthContext } from './AuthContext';
import { UserContext } from './UserContext';

const CompanyContext = createContext()

const CompanyProvider = ({ children }) => {
    const authContext = useContext(AuthContext)
    const userContext = useContext(UserContext)
    const [company, setCompany] = useState(null)

    useEffect(() => {
        const fetchData = async (lastCompanyId) => {
             const availableCompanies = (await getCompanies() || []).map(o => o.id)
             const company = availableCompanies.includes(lastCompanyId)
                ? await getCompany(lastCompanyId)
                : availableCompanies.length
                    ? await getCompany(availableCompanies[0])
                    : null
            if (company) {
                setCompany(company)
                localStorage.setItem('company_id', company.id)
            } else {
                localStorage.removeItem('company_id')
                setCompany(null)
            }
        }

        if (authContext.isAuth) {
            fetchData(localStorage.getItem('company_id'))
                .catch(console.error)
        } else {
            setCompany(null)
        }
    }, [authContext, userContext])

    return <CompanyContext.Provider value={{ company, setCompany }}>{children}</CompanyContext.Provider>
}

export { CompanyContext, CompanyProvider }