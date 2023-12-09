import React, { useContext, useEffect, useState } from 'react';
import {
    Collapse, Navbar, NavbarToggler, Nav, DropdownMenu, DropdownItem, UncontrolledDropdown, Label,
} from 'reactstrap';
import { NavLink, useNavigate } from "react-router-dom"
import { NavLink as NavLinkStrap } from "reactstrap"
import {
    BoxArrowInRight, BoxArrowLeft, PersonPlus, Person, Briefcase,
    FileRuled, PersonVcard, Gear, CaretDownFill, People
} from 'react-bootstrap-icons'

import { AuthContext } from '../context/AuthContext'
import { Delimiter } from './Delimiter'
import { logout } from "../services/authService"
import { UserContext } from '../context/UserContext'
import { DropdownToggle } from '../components/DropdownToggle'
import { CompanyContext } from '../context/CompanyContext';
import { getCompanies } from '../services/companyService';
import { dateToTime } from '../services/dateService';

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
    }, [authContext, userContext])

    const onLogout = async (e) => {
        e.preventDefault()
        await logout()
        authContext.setIsAuth(false)
        navigate('/', { replace: true })
        return false
    }

    const onHome = async (e) => {
        e.preventDefault()
        navigate('/', { replace: true })
        return false
    }

    const onDummy = async (e) => {
        e.preventDefault()
        return false
    }

    const onCreateCompany = () => {
        navigate('/company/', { replace: true })
    }

    const onSelectCompany = (element) => {
        const id = element.target.dataset?.id
        if (id) {
            navigate(`/company/${id}`, { replace: true })
        }
    }

    const today = dateToTime(Date.now())
    const actualCompanies = companies ? companies.filter(o =>
        dateToTime(o.deleted) > today &&
        dateToTime(o.date_from) <= today &&
        dateToTime(o.date_to) >= today
    ) : []
    const nonActualCompanies = companies ? companies.filter(o => actualCompanies.findIndex(a => a.id === o.id) < 0) : []

    return (
        <Navbar {...args} className={"h-lg-100 navbar-expand-sm navbar-light bg-light flex-column m-0 p-0 " + args.className}>
            <NavbarToggler onClick={toggle}></NavbarToggler>
            <Collapse isOpen={isOpen} navbar>
                <Nav pills vertical className='col-12 nav nav-pills'>
                    <NavLinkStrap onClick={onHome} className="brand-text text-body mx-0 px-0 mt-2 mb-0" style={{ cursor: "pointer" }}>
                        <h1 className='p-2 my-auto fs-5'>
                            <img className="opacity-50" height="48" src={process.env.PUBLIC_URL + '/payroll.png'} alt="" /> Payroll SMB</h1>
                    </NavLinkStrap>

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

                    {authContext?.isAuth ?
                        <NavLink to="/company" className="m-0 p-2" onClick={onDummy}>
                            <Briefcase size={24} className="me-4" />

                            <UncontrolledDropdown tag="nav-link">
                                <DropdownToggle tag="nav-link" caret key={1}>
                                    {companyContext.company ? companyContext.company.name : 'Company'} <CaretDownFill size={12} className="me-4" />
                                </DropdownToggle>
                                <DropdownMenu className='position-absolute top-0 end-0 shadow-sm'>
                                    <Label className='mx-3 text-secondary'>Select company</Label>
                                    {actualCompanies.map((company, key) => {
                                        return (
                                            <>
                                                <DropdownItem
                                                    key={1 + key}
                                                    data-id={company.id}
                                                    onClick={onSelectCompany}
                                                    className='ps-4'
                                                >
                                                    {company?.name}
                                                </DropdownItem>
                                            </>
                                        )
                                    })}

                                    {authContext?.isAuth && userContext?.user?.is_employer ?
                                        <>
                                            {actualCompanies.length ? <DropdownItem divider className='mx-3' /> : null}

                                            <DropdownItem key={100} onClick={onCreateCompany} className='ps-4'>Create new company</DropdownItem>

                                            {nonActualCompanies.length ? <DropdownItem divider className='mx-3' /> : null}

                                            {nonActualCompanies.length ? <Label className='mx-3 text-secondary'>Deleted and not actual</Label> : null}

                                            {nonActualCompanies.map((company, key) => {
                                                return (
                                                    <>
                                                        <DropdownItem
                                                            key={101 + key}
                                                            data-id={company.id}
                                                            onClick={onSelectCompany}
                                                            className='ps-4'
                                                        >
                                                            {company?.name}
                                                        </DropdownItem>
                                                    </>
                                                )
                                            })}
                                        </> : null}

                                </DropdownMenu>
                            </UncontrolledDropdown>

                        </NavLink>
                        : null}

                    {authContext?.isAuth && userContext?.user?.is_employer && companyContext.company
                        ? <>

                            {/* <Delimiter /> */}

                            {/* <NavLink to="/dashboard" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Activity size={24} className="me-4" />Dashboard</NavLink> */}

                            {/* <NavLink to="/staff" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <People size={24} className="me-4" />Staff list</NavLink> */}

                            <NavLink to="/employees" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <People size={24} className="me-4" />Employees</NavLink>

                            <NavLink to="/payroll-sheet" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <FileRuled size={24} className="me-4" />Payroll</NavLink>
                        </>
                        : null}
                    {/* <Delimiter /> */}

                    {authContext?.isAuth && userContext?.user?.is_employee && companyContext.company
                        ? <>
                            <NavLink to="/personal-card" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <PersonVcard size={24} className="me-4" />Personal card</NavLink>

                            <NavLink to="/payroll" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <FileRuled size={24} className="me-4" />Payroll</NavLink>
                        </>
                        : null}
                    <Delimiter />

                    {/* <NavLink to="/language" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                        <Globe size={24} className="me-4" />Language</NavLink> */}

                    {/* {authContext?.isAuth && userContext?.user?.is_employer
                        ? <>
                            <NavLink to="/settings" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Gear size={24} className="me-4" />Settings</NavLink>
                        </>
                        : null} */}

                    {authContext?.isAuth
                        ? <>
                            <NavLink to="/profile/" className={({ isActive, isPending }) => isPending ? "m-0 p-2 pending" : isActive ? "m-0 p-2 active" : "m-0 p-2"}>
                                <Person size={24} className="me-4" />Profile</NavLink>

                            <NavLinkStrap to="#" className="m-0 p-2 text-body" style={{ cursor: "pointer" }}>
                                <BoxArrowLeft size={24} className="me-4" />
                                <UncontrolledDropdown tag="nav-link">
                                    <DropdownToggle tag="nav-link" caret>Logout</DropdownToggle>
                                    <DropdownMenu className='position-absolute shadow-sm'>
                                        <Label className='mx-3 text-secondary'>Are you sure?</Label>
                                        <DropdownItem
                                            key={1}
                                            onClick={onLogout}
                                            className='ps-4 w-100'
                                        >
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </NavLinkStrap>
                        </>
                        : null
                    }

                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default AppSidenav;