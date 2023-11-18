import React, { useContext, useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
} from 'reactstrap';
import { NavLink } from "react-router-dom"
import {
    BoxArrowInRight, BoxArrowLeft, PersonPlus, Person, Briefcase, Activity,
    People, PeopleFill, FileRuled, PersonVcard, PersonVcardFill, Gear, Globe
} from 'react-bootstrap-icons';

import { AuthContext } from '../context/AuthContext';
import Delimiter from './Delimiter';
import LogoutButton from './LogoutButton';

function AppSidenav(args) {
    const [isOpen, setIsOpen] = useState(false);
    const isAuth = useContext(AuthContext);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar {...args} className={"h-lg-100 navbar-expand-sm navbar-light bg-light flex-column shadow-sm bg-body-tertiary " + args.className}>
            <NavbarToggler onClick={toggle}></NavbarToggler>
            <Collapse isOpen={isOpen} navbar>
                <Nav pills vertical className='col-12'>
                    <NavLink to="/" className="brand-text text-body my-2">
                        <h1 className='border-bottom p-2 my-auto fs-5'>
                            <img className="opacity-50" height="48" src={process.env.PUBLIC_URL + '/payroll.png'} alt="" /> Payroll SMB</h1>
                    </NavLink>

                    {!isAuth ? <NavLink to="/register" className="m-1 p-1">
                        <PersonPlus size={24} className="me-4" />Register</NavLink> : null}
                    {!isAuth ? <NavLink to="/login" className="m-1 p-1">
                        <BoxArrowInRight size={24} className="me-4" />Login</NavLink> : null}
                    {isAuth ?
                        <>

                            <NavLink to="/company" className="m-1 p-1">
                                <Briefcase size={24} className="me-4" />Company</NavLink>

                            <NavLink to="/profile" className="m-1 p-1">
                                <Person size={24} className="me-4" />Profile</NavLink>

                            <Delimiter />

                            <NavLink to="/dashboard" className="m-1 p-1">
                                <Activity size={24} className="me-4" />Dashboard</NavLink>

                            <NavLink to="/staff" className="m-1 p-1">
                                <People size={24} className="me-4" />Staff list</NavLink>

                            <NavLink to="/employees" className="m-1 p-1">
                                <PeopleFill size={24} className="me-4" />Employees</NavLink>

                            <NavLink to="/payroll-sheet" className="m-1 p-1">
                                <FileRuled size={24} className="me-4" />Payroll sheet</NavLink>

                            <Delimiter />

                            <NavLink to="/personal-card" className="m-1 p-1">
                                <PersonVcard size={24} className="me-4" />Personal card</NavLink>

                            <NavLink to="/payroll" className="m-1 p-1">
                                <PersonVcardFill size={24} className="me-4" />Payroll</NavLink>

                            <Delimiter />

                            <NavLink to="/settings" className="m-1 p-1">
                                <Gear size={24} className="me-4" />Settings</NavLink>

                            <NavLink to="/language" className="m-1 p-1">
                            <Globe size={24} className="me-4" />Language</NavLink>

                            <NavLink to="/logout" className="m-1 p-1">
                                <BoxArrowLeft size={24} className="me-4" />Logout</NavLink>

                                <LogoutButton />
                        </>
                        : null}
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;