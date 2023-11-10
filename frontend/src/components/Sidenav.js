import React, { useState } from 'react';
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

    const toggle = () => setIsOpen(!isOpen);

    return (
            <Navbar {...args} className={"h-100 navbar-expand-sm navbar-light bg-light flex-column " + args.className}>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav pills vertical className='col-12'>
                        <NavbarBrand href="/" className="brand-text text-center">
                            {/* <BrandLogo className="my-auto" /> */}
                            Payroll SMB
                        </NavbarBrand>

                        <NavItem><NavLink><Link to="/login">Login</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/register">Register</Link></NavLink></NavItem>

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

                        <NavItem><NavLink><Link to="/profile">Profile</Link></NavLink></NavItem>

                        <Delimiter />

                        <NavItem><NavLink><Link to="/dashboard">Dashboard</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/staff">Staff list</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/employees">Employees</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/payroll-sheet">Payroll sheet</Link></NavLink></NavItem>

                        <Delimiter />

                        <NavItem><NavLink><Link to="/personal-card">Personal card</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/payroll">Payroll</Link></NavLink></NavItem>

                        <Delimiter />

                        <NavItem><NavLink><Link to="/settings">Settings</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/language">Language</Link></NavLink></NavItem>
                        <NavItem><NavLink><Link to="/logout">Logout</Link></NavLink></NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
    );
}

export default AppSidenav;