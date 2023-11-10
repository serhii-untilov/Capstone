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

import BrandLogo from './BrandLogo';
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

                        <NavItem><NavLink href="/login/">Login</NavLink></NavItem>
                        <NavItem><NavLink href="/register/" >Register</NavLink></NavItem>

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

                        <NavItem><NavLink active href="/profile/" >Profile</NavLink></NavItem>

                        <Delimiter />

                        <NavItem><NavLink href="/dashboard/" >Dashboard</NavLink></NavItem>
                        <NavItem><NavLink href="/staff/" >Staff list</NavLink></NavItem>
                        <NavItem><NavLink href="/employees/" >Employees</NavLink></NavItem>
                        <NavItem><NavLink href="/payroll-sheet/" >Payroll sheet</NavLink></NavItem>

                        <Delimiter />

                        <NavItem><NavLink href="/personal-card/" >Personal card</NavLink></NavItem>
                        <NavItem><NavLink href="/payroll/" >Payroll</NavLink></NavItem>

                        <Delimiter />

                        <NavItem><NavLink href="/settings/" >Settings</NavLink></NavItem>
                        <NavItem><NavLink href="/language/" >Language</NavLink></NavItem>
                        <NavItem><NavLink href="/logout/" >Logout</NavLink></NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
    );
}

export default AppSidenav;