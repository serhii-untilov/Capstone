import { Routes, Route, Navigate } from "react-router-dom"
import Company from "../pages/Company"
import Dashboard from "../pages/Dashboard"
import Employees from "../pages/Employees"
import Home from "../pages/Home"
import Language from "../pages/Language"
import Login from "../pages/Login"
import Payroll from "../pages/Payroll"
import PayrollSheet from "../pages/PayrollSheet"
import PersonalCard from "../pages/PersonalCard"
import Profile from "../pages/Profile"
import Register from "../pages/Register"
import Settings from "../pages/Settings"
import Staff from "../pages/Staff"

export default function Router() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/language" element={<Language />} />

            <Route path="/company/:companyId" element={<Company />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/payroll-sheet" element={<PayrollSheet />} />
            <Route path="/personal-card" element={<PersonalCard />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="*" element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}
