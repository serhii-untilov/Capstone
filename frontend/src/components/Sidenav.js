import React, { useContext, useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
} from 'reactstrap';
import { NavLink, useNavigate } from "react-router-dom"
import {
    BoxArrowInRight, BoxArrowLeft, PersonPlus, Person, Briefcase, Activity,
    People, PeopleFill, FileRuled, PersonVcard, PersonVcardFill, Gear, CaretDownFill,
    // Globe
} from 'react-bootstrap-icons'

import { AuthContext } from '../context/AuthContext'
import Delimiter from './Delimiter'
import { logout } from "../services/authService"
import { UserContext } from '../context/UserContext'
import DropdownToggle from '../components/DropdownToggle'
import { CompanyContext } from '../context/CompanyContext';
import { getCompanies } from '../services/companyService';

function AppSidenav(args) {
    const authContext = useContext(AuthContext)
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [companies, setCompanies] = useState([])

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const fetchData = async () => {
            setCompanies(await getCompanies())
        }
        if (authContext.isAuth) {
            fetchData().catch(console.error)
        }
    }, [authContext])

    const onLogout = async (e) => {
        e.preventDefault()
        await logout()
        authContext.setIsAuth(false)
        navigate('/', { replace: true })
        return false
    }

    const onDummy = async (e) => {
        e.preventDefault()
        return false
    }

    const onCreateCompany = () => {
       navigate('/company/new', { replace: true })
    }

    const onSelectCompany = (element) => {
        const companyId = element.target.dataset?.id
        if (companyId) {
            navigate(`/company/${companyId}`, { replace: true })
        }
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

                    {!authContext?.isAuth
                        ? <NavLink to="/register" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                            <PersonPlus size={24} className="me-4" />Register
                        </NavLink>
                        : null}

                    {!authContext?.isAuth
                        ? <NavLink to="/login" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                            <BoxArrowInRight size={24} className="me-4" />Login</NavLink>
                        : null
                    }

                    {authContext?.isAuth && userContext?.user?.is_employer
                        ? <>
                            {/* <NavLink to="/company" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Briefcase size={24} className="me-4" />Company</NavLink> */}

                            <NavLink to="/company" className="m-0 p-2" onClick={onDummy}>
                                <Briefcase size={24} className="me-4" />

                                <UncontrolledDropdown tag="nav-link">
                                    <DropdownToggle tag="nav-link" caret>
                                        {companyContext.company ? companyContext.company.name : 'Company'} <CaretDownFill size={12} className="me-4" />
                                    </DropdownToggle>
                                    <DropdownMenu className='position-absolute top-0 end-0 shadow'>
                                        <Label className='mx-3 text-secondary'>Select company</Label>
                                        {companies.map(company => {
                                            return (
                                                <>
                                                <DropdownItem data-id={company.id} onClick={onSelectCompany}>
                                                    {company.name}
                                                </DropdownItem>
                                                </>
                                            )
                                        })}
                                        {companies.length ? <DropdownItem divider /> : null}
                                        <DropdownItem onClick={onCreateCompany}>Create new</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                            </NavLink>
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
                        </>
                        : null}
                    <Delimiter />

                    {authContext?.isAuth && userContext?.user?.is_employee
                        ? <>
                            <NavLink to="/personal-card" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <PersonVcard size={24} className="me-4" />Personal card</NavLink>

                            <NavLink to="/payroll" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <PersonVcardFill size={24} className="me-4" />Payroll</NavLink>
                        </>
                        : null}
                    <Delimiter />

                    {/* <NavLink to="/language" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                        <Globe size={24} className="me-4" />Language</NavLink> */}

                    {authContext?.isAuth
                        ? <>
                            <NavLink to="/settings" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Gear size={24} className="me-4" />Settings</NavLink>

                            <NavLink to="/dummy" onClick={onLogout} className="m-0 p-2">
                                <BoxArrowLeft size={24} className="me-4" />Logout</NavLink>
                        </>
                        : null
                    }

                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;