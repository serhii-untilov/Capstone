import React, { useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { NavLink } from "react-router-dom"

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
        <Navbar {...args} className={"h-100 navbar-expand-sm navbar-light bg-light flex-column " + args.className}>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav pills vertical className='col-12'>
                    <NavLink to="/" className="brand-text text-center text-body">Payroll SMB</NavLink>

                    <NavLink to="/" className="m-1 p-1">Home</NavLink>

                    {!isAuth ? <NavLink to="/register" className="m-1 p-1">Register</NavLink> : null}
                    {!isAuth ? <NavLink to="/login" className="m-1 p-1">Login</NavLink> : null}
                    {isAuth ?
                        <>
                            <Delimiter />

                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret >Company name</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Company 1</DropdownItem>
                                    <DropdownItem>Company 2</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>Register Company</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                            <NavLink to="/profile" className="m-1 p-1">Profile</NavLink>

                            <Delimiter />

                            <NavLink to="/dashboard" className="m-1 p-1">Dashboard</NavLink>
                            <NavLink to="/staff" className="m-1 p-1">Staff list</NavLink>
                            <NavLink to="/employees" className="m-1 p-1">Employees</NavLink>
                            <NavLink to="/payroll-sheet" className="m-1 p-1">Payroll sheet</NavLink>

                            <Delimiter />

                            <NavLink to="/personal-card" className="m-1 p-1">Personal card</NavLink>
                            <NavLink to="/payroll" className="m-1 p-1">Payroll</NavLink>

                            <Delimiter />

                            <NavLink to="/settings" className="m-1 p-1">Settings</NavLink>
                            <NavLink to="/language" className="m-1 p-1">Language</NavLink>
                            <NavLink to="/logout" className="m-1 p-1">Logout</NavLink>
                        </>
                        : null}
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;