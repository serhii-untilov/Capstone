import React, { useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { Link } from "react-router-dom"

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
                    <Link to="/" className="brand-text text-center text-body">Payroll SMB</Link>

                    <NavItem><Link to="/">Home</Link></NavItem>

                    {!isAuth ? <NavItem><Link to="/register">Register</Link></NavItem> : null}
                    {!isAuth ? <NavItem><Link to="/login">Login</Link></NavItem> : null}
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

                            <NavItem><Link to="/profile">Profile</Link></NavItem>

                            <Delimiter />

                            <NavItem><Link to="/dashboard">Dashboard</Link></NavItem>
                            <NavItem><Link to="/staff">Staff list</Link></NavItem>
                            <NavItem><Link to="/employees">Employees</Link></NavItem>
                            <NavItem><Link to="/payroll-sheet">Payroll sheet</Link></NavItem>

                            <Delimiter />

                            <NavItem><Link to="/personal-card">Personal card</Link></NavItem>
                            <NavItem><Link to="/payroll">Payroll</Link></NavItem>

                            <Delimiter />

                            <NavItem><Link to="/settings">Settings</Link></NavItem>
                            <NavItem><Link to="/language">Language</Link></NavItem>
                            <NavItem><Link to="/logout">Logout</Link></NavItem>
                        </>
                        : null}
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;