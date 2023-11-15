import React, { useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { NavLink } from "react-router-dom"
import {
    BoxArrowInRight,
    BoxArrowLeft, PersonPlus, Person, Briefcase, Activity, People, PeopleFill, FileRuled, PersonVcard, PersonVcardFill, Gear, Globe
} from 'react-bootstrap-icons';

import Delimiter from './Delimiter';

function AppSidenav(args) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setIsAuth(true);
        }
    }, [isAuth]);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar {...args} className={"h-lg-100 navbar-expand-sm navbar-light bg-light flex-column shadow-sm bg-body-tertiary " + args.className}>
            <NavbarToggler onClick={toggle}></NavbarToggler>
            <Collapse isOpen={isOpen} navbar>
                <Nav pills vertical className='col-12'>
                    <NavLink to="/" className="brand-text text-body my-2">
                        <h5 className='text-primary border-bottom p-2 my-auto '>
                            <img height="48" src={process.env.PUBLIC_URL + '/payroll.png'} alt="" /> Payroll SMB</h5>
                    </NavLink>

                    {/* <NavLink to="/" className="m-1 p-1">Home</NavLink> */}

                    {!isAuth ? <NavLink to="/register" className="m-1 p-1">
                        <PersonPlus color="royalblue" size={24} className="me-3" />Register</NavLink> : null}
                    {!isAuth ? <NavLink to="/login" className="m-1 p-1">
                        <BoxArrowInRight color="royalblue" size={24} className="me-3" />Login</NavLink> : null}
                    {isAuth ?
                        <>
                            <Delimiter />

                            <NavLink to="/company" className="m-1 p-1">
                                <Briefcase color="royalblue" size={24} className="me-3" />Company</NavLink>

                            <NavLink to="/profile" className="m-1 p-1">
                                <Person color="royalblue" size={24} className="me-3" />Profile</NavLink>

                            <Delimiter />

                            <NavLink to="/dashboard" className="m-1 p-1">
                                <Activity color="royalblue" size={24} className="me-3" />Dashboard</NavLink>

                            <NavLink to="/staff" className="m-1 p-1">
                                <People color="royalblue" size={24} className="me-3" />Staff list</NavLink>

                            <NavLink to="/employees" className="m-1 p-1">
                                <PeopleFill color="royalblue" size={24} className="me-3" />Employees</NavLink>

                            <NavLink to="/payroll-sheet" className="m-1 p-1">
                                <FileRuled color="royalblue" size={24} className="me-3" />Payroll sheet</NavLink>

                            <Delimiter />

                            <NavLink to="/personal-card" className="m-1 p-1">
                                <PersonVcard color="royalblue" size={24} className="me-3" />Personal card</NavLink>

                            <NavLink to="/payroll" className="m-1 p-1">
                                <PersonVcardFill color="royalblue" size={24} className="me-3" />Payroll</NavLink>

                            <Delimiter />

                            <NavLink to="/settings" className="m-1 p-1">
                                <Gear color="royalblue" size={24} className="me-3" />Settings</NavLink>

                            <NavLink to="/language" className="m-1 p-1">
                            <Globe color="royalblue" size={24} className="me-3" />Language</NavLink>

                            <NavLink to="/logout" className="m-1 p-1">
                                <BoxArrowLeft color="royalblue" size={24} className="me-3" />Logout</NavLink>
                        </>
                        : null}
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;