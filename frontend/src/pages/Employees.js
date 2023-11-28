import { ButtonGroup, Table } from "reactstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination"
import { getEmployees } from "../services/employeeService";
import { TableToolbar } from "../components/TableToolbar";

export default function Employees() {
    const navigate = useNavigate()
    const tableHead = [{ name: 'Name', class: '' }, { name: 'Tax ID', class: '' }, { name: 'Begin', class: '' }, { name: 'End', class: '' }]
    const [tableData, setTableData] = useState([])
    const rowData = [(row) => row.name, (row) => row.tax_id, (row) => row.dateFrom, (row) => row.dateTo]

    const fetchData = async () => {
        const employees = await getEmployees()
        setTableData(employees)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onRefreshTable = () => {
        fetchData()
    }

    const onNewEmployee = () => {
        navigate('/employee')
    }

    return (
        <>
            {!tableData ? <h3>Loading...</h3> :
                <div className="col-12 h-100 bg-light py-4">
                    <div className="col-12 h-100 bg-white rounded-1 p-3 shadow-sm border border-light-subtle position-relative ">

                        <div className="d-flex justify-content-between flex-wrap">
                            <TableToolbar onRefresh={onRefreshTable} onAdd={onNewEmployee} className="col-4 align-bottom" />
                            <PageHeader text="Employees" className="col-4 pb-3" />

                            <ButtonGroup className="col-4 d-flex justify-content-end">
                                <Pagination />
                            </ButtonGroup>
                        </div>


                        <Table
                            bordered
                            hover
                            responsive
                            className="m-0 p-0"

                        >
                            <thead className="table-light">
                                <tr>
                                    {tableHead.map(col => (<th className={col.class}>{col.name}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map(row => {
                                    return <tr>{rowData.map((col) => { return <td>{col(row)}</td> })}</tr>
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            }
        </>
    )
}