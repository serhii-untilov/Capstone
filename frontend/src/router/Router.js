import React, { useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"

import Company from "../pages/Company"
import Dashboard from "../pages/Dashboard"
import Employees from "../pages/Employees"
import Home from "../pages/Home"
import Language from "../pages/Language"
import Login from "../pages/Login"
import Logout from "../pages/Logout"
import Payroll from "../pages/Payroll"
import PayrollSheet from "../pages/PayrollSheet"
import PersonalCard from "../pages/PersonalCard"
import Profile from "../pages/Profile"
import Register from "../pages/Register"
import RegisterCompany from "../pages/RegisterCompany"
import Settings from "../pages/Settings"
import Staff from "../pages/Staff"
// import { PublicRoute } from './PublicRoute'
import { AuthContext } from '../context/AuthContext'

export default function Router() {
    const isAuthenticated = useContext(AuthContext);

    useEffect(() => {
        console.log('useEffect')
    }, [isAuthenticated])

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* <PublicRoute
                restricted={false}
                isAuthenticated={isAuthenticated}
                component={Login}
                path="/login"
                exact
            /> */}

            <Route path="/register" element={<Register />} />

            {isAuthenticated ?
                <>
                    <Route path="/company" element={<Company />} />
                    <Route path="/register-company" element={<RegisterCompany />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/payroll-sheet" element={<PayrollSheet />} />
                    <Route path="/personal-card" element={<PersonalCard />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/language" element={<Language />} />
                    <Route path="/logout" element={<Logout />} />
                </>
                : null}

            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}
