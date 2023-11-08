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

function AppNavbar(args) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar {...args}>
                <NavbarBrand href="/">Payroll</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Company
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>Company 1</DropdownItem>
                                <DropdownItem>Company 2</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Register Company</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                    </Nav>
                    <Nav navbar>
                        <NavItem>
                            <NavLink href="/home/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/register/">Register</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/login/">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/logout/">Logout</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/language/">Language</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/profile/">Profile</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default AppNavbar;