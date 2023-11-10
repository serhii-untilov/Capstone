import React from 'react';
import { Switch, Route } from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import Company from "./components/Company"
import RegisterCompany from "./components/RegisterCompany"
import Profile from "./components/Profile"
import Dashboard from "./components/Dashboard"
import Staff from "./components/Staff"
import Employees from "./components/Employees"
import PayrollSheet from "./components/PayrollSheet"
import PersonalCard from "./components/PersonalCard"
import Payroll from "./components/Payroll"
import Settings from "./components/Settings"
import Language from "./components/Language"
import Logout from "./components/Logout"
import Home from "./components/Home"

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
