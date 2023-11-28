import { Link } from "react-router-dom"
import { Button } from "../components/Button"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
    const authContext = useContext(AuthContext)

    return (
        <div className="h-100 overflow-auto">
            <h2 className="text-center pt-3 text-body fs-4">Welcome to Payroll SMB</h2>
            <h3 className="text-center pb-1 fs-5 fw-normal">Payroll solutions to Small and Medium Business</h3>
            <div className="row justify-content-center">



            <div className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-3 bg-white position-relative">
                    <h4 className="text-center text-primary p-2">What we offer</h4>
                    <img height="164" src={process.env.PUBLIC_URL + '/fat-asterisk.png'} alt=""
                        className="opacity-50 position-absolute top-0 end-0" />
                    <ul>
                        <li className="py-2">Managing of payroll accounting policy of the company</li>
                        <li className="py-2">Maintaining proper employee records</li>
                        <li className="py-2">Calculating the right deductions and taxes</li>
                        <li className="py-2">Handling employee benefits</li>
                        <li className="py-2">Staying compliant with federal and state government regulations</li>
                    </ul>
                </div>

                <div className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-3 bg-white position-relative">
                    <h4 className="text-center text-primary p-2">The purpose</h4>
                    <img height="164" src={process.env.PUBLIC_URL + '/point.png'} alt=""
                        className="opacity-25 position-absolute top-0 end-0" />
                    <p>The Payroll SMB application is designed to calculate wages to employees.</p>
                    <p>The users of the application are divided into two categories - employers and employees.</p>
                    <p>Each category has a user role. User role is defined during user registration.</p>
                    <p>According to the user's role, the program provides access to information about the input data and results of payroll, as well as the functions of calculating and paying wages to employees.</p>
                </div>

                <div className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-3 bg-white position-relative">
                    <h4 className="text-center text-primary p-2">Employers</h4>
                    <img height="164" src={process.env.PUBLIC_URL + '/upto.png'} alt=""
                        className="opacity-25 position-absolute bottom-0 end-0" />
                    <p>They register the Company, form a staff list, form employee cards and assign them to positions.</p>
                    <p>For each employee, the payment system (hourly or monthly), the amount of payment, the taxation system, the parameters of salary payment (bank, recipient's current account) are determined.</p>
                    <p>Salary is calculated automatically.</p>
                    <p>Wages are paid by transferring the lists of employees and the amount "To be paid" to bank institutions, according to the information about the payment in the employees' cards.</p>
                </div>

                <div className="col-lg-5 col-sm-11 shadow-sm border border-light-subtle p-3 rounded-1 m-3 bg-white position-relative">
                    <h4 className="text-center text-primary p-2">Employees</h4>
                    <img height="164" src={process.env.PUBLIC_URL + '/payroll.png'} alt=""
                        className="opacity-25 position-absolute bottom-0 end-0" />
                    <p>The user has the opportunity to view his personal account and salary statement.</p>
                    <p>The user's account is connected to the personal account of the payroll register after confirmation by e-mail. The key to connection is the employee's email address. Therefore, when registering, the user indicates his email.</p>
                </div>

            </div>
            {!authContext.isAuth ?
            <div className="text-center mt-1 mb-3">
                <h4>To start</h4>
                <Link to="/register"><Button color="primary" className="bg-gradient btn-fixed-width">Register</Button></Link>
                <span> or </span>
                <Link to="/login"><Button color="primary" className="bg-gradient btn-fixed-width">Login</Button></Link>
            </div>
            : null }
        </div>

    )
}
