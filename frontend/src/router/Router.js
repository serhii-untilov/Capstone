import { Routes, Route, Navigate } from "react-router-dom"
import Company from "../pages/Company"
import Dashboard from "../pages/Dashboard"
import Employees from "../pages/Employees"
import Home from "../pages/Home"
import Language from "../pages/Language"
import Login from "../pages/Login"
import PayrollSheet from "../pages/PayrollSheet"
import PersonalCard from "../pages/PersonalCard"
import Profile from "../pages/Profile"
import Register from "../pages/Register"
import Settings from "../pages/Settings"
import Staff from "../pages/Staff"
import { RequireAuth } from "./RequireAuth"
import { Employee } from "../pages/Employee"
import PayrollDetails from "../pages/PayrollDetails"

export default function Router() {

    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/language" element={<Language />} />

            <Route path="/company/" element={<RequireAuth children={<Company />} />} />
            <Route path="/company/:id" element={<RequireAuth children={<Company />} />} />
            <Route path="/profile" element={<RequireAuth children={<Profile />} />} />
            <Route path="/dashboard" element={<RequireAuth children={<Dashboard />} />} />
            <Route path="/staff" element={<RequireAuth children={<Staff />} />} />
            <Route path="/employees" element={<RequireAuth children={<Employees />} />} />
            <Route path="/employee" element={<RequireAuth children={<Employee />} />} />
            <Route path="/employee/:id" element={<RequireAuth children={<Employee />} />} />
            <Route path="/payroll-sheet" element={<RequireAuth children={<PayrollSheet />} />} />
            <Route path="/personal-card" element={<RequireAuth children={<PersonalCard />} />} />
            <Route path="/payroll-details/:id/:period" element={<RequireAuth children={<PayrollDetails />} />} />
            <Route path="/settings" element={<RequireAuth children={<Settings />} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
