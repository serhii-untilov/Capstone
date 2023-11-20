import React, { useContext, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
} from 'reactstrap';
import { NavLink, useNavigate } from "react-router-dom"
import {
    BoxArrowInRight, BoxArrowLeft, PersonPlus, Person, Briefcase, Activity,
    People, PeopleFill, FileRuled, PersonVcard, PersonVcardFill, Gear,
    // Globe
} from 'react-bootstrap-icons';

import { AuthContext } from '../context/AuthContext';
import Delimiter from './Delimiter';
import { logout } from "../services/authService"

function AppSidenav(args) {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const handleLogout = async (e) => {
        e.preventDefault()
        await logout()
        authContext.setIsAuth(false)
        navigate('/', { replace: true })
        return false
    }

    return (
        <Navbar {...args} className={"h-lg-100 navbar-expand-sm navbar-light bg-light flex-column shadow-sm bg-body-tertiary " + args.className}>
            <NavbarToggler onClick={toggle}></NavbarToggler>
            <Collapse isOpen={isOpen} navbar>
                <Nav pills vertical className='col-12 nav nav-pills'>
                    <NavLink to="/" className="brand-text text-body my-2">
                        <h1 className='p-2 my-auto fs-5'>
                            <img className="opacity-50" height="48" src={process.env.PUBLIC_URL + '/payroll.png'} alt="" /> Payroll SMB</h1>
                    </NavLink>

                    {!authContext.isAuth
                        ? <NavLink to="/register" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                            <PersonPlus size={24} className="me-4" />Register
                        </NavLink>
                        : null}

                    {!authContext.isAuth
                        ? <NavLink to="/login" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                            <BoxArrowInRight size={24} className="me-4" />Login</NavLink>
                        : null
                    }

                    {authContext.isAuth
                        ? <>
                            <NavLink to="/company" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Briefcase size={24} className="me-4" />Company</NavLink>

                            <NavLink to="/profile" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Person size={24} className="me-4" />Profile</NavLink>

                            <Delimiter />

                            <NavLink to="/dashboard" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Activity size={24} className="me-4" />Dashboard</NavLink>

                            <NavLink to="/staff" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <People size={24} className="me-4" />Staff list</NavLink>

                            <NavLink to="/employees" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <PeopleFill size={24} className="me-4" />Employees</NavLink>

                            <NavLink to="/payroll-sheet" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <FileRuled size={24} className="me-4" />Payroll sheet</NavLink>

                            <Delimiter />

                            <NavLink to="/personal-card" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <PersonVcard size={24} className="me-4" />Personal card</NavLink>

                            <NavLink to="/payroll" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <PersonVcardFill size={24} className="me-4" />Payroll</NavLink>

                            <Delimiter />

                            <NavLink to="/settings" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Gear size={24} className="me-4" />Settings</NavLink>
                        </>
                        : null}

                    {/* <NavLink to="/language" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                        <Globe size={24} className="me-4" />Language</NavLink> */}

                    {authContext.isAuth
                        ? <NavLink to="/dummy" onClick={handleLogout} className="m-0 p-2">
                            <BoxArrowLeft size={24} className="me-4" />Logout</NavLink>
                        : null
                    }

                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;