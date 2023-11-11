import React from 'react';
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Company from "./pages/Company"
import RegisterCompany from "./pages/RegisterCompany"
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard"
import Staff from "./pages/Staff"
import Employees from "./pages/Employees"
import PayrollSheet from "./pages/PayrollSheet"
import PersonalCard from "./pages/PersonalCard"
import Payroll from "./pages/Payroll"
import Settings from "./pages/Settings"
import Language from "./pages/Language"
import Logout from "./pages/Logout"
import Home from "./pages/Home"

export default function Routes() {
    return (
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/company" exact component={Company} />
            <Route path="/register-company" exact component={RegisterCompany} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/staff" exact component={Staff} />
            <Route path="/employees" exact component={Employees} />
            <Route path="/payroll-sheet" exact component={PayrollSheet} />
            <Route path="/personal-card" exact component={PersonalCard} />
            <Route path="/payroll" exact component={Payroll} />
            <Route path="/settings" exact component={Settings} />
            <Route path="/language" exact component={Language} />
            <Route path="/logout" exact component={Logout} />
            <Route path="/" exact component={Home} />
        </Switch>
    )
}
