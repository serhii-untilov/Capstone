import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getEmployeeByUserId } from "../services/employeeService";
import { Toast } from "../components/Toast";
import { CompanyContext } from "../context/CompanyContext";
import { Employee } from "./Employee";

export default function PersonalCard() {
    const userContext = useContext(UserContext)
    const companyContext = useContext(CompanyContext)
    const [employee, setEmployee] = useState()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetchData = (company_id, user_id) => {
            getEmployeeByUserId(company_id, user_id)
                .then(data => {
                    setEmployee(data[0])
                })
                .catch((error) => setMessages([error.message || 'Error while reading employee data.']))
        }
        if (companyContext.company?.id && userContext.user?.id) {
            fetchData(companyContext.company.id, userContext.user.id)
        }
    }, [userContext, companyContext])

    return (
        employee ? <Employee id={employee.id} /> :
        <>
            <h3>Loading...</h3>
            <Toast
                title="Get employee data"
                messages={messages}
                close={() => { setMessages([]) }}
            />
        </>
    )
}