import { Button, ButtonGroup, Table } from "reactstrap";
import PageHeader from "../components/PageHeader";
import { ArrowClockwise, Plus } from "react-bootstrap-icons";
import Pagination from "../components/Pagination"
import { useEffect, useState } from "react";
import { getEmployees } from "../services/employeeService";
import { redirect, useNavigate } from "react-router-dom";

export default function Employees() {
    const navigate = useNavigate()
    const [filterVisible, setFilterVisible] = useState(false)
    const [filterParams, setFilterParams] = useState('')
    const tableHead = [{ name: 'Name', class: '' }, { name: 'Tax ID', class: '' }, { name: 'Begin', class: '' }, { name: 'End', class: '' }]
    const [tableData, setTableData] = useState([])
    const rowData = [(row) => row.name, (row) => row.tax_id, (row) => row.dateFrom, (row) => row.dateTo]

    useEffect(() => {
        const fetchData = async () => {
            const employees = await getEmployees()
            setTableData(employees)
        }
        fetchData()
    }, [])

    const onNewEmployee = () => {
        navigate('/employee')
    }

    return (
        <>
            {!tableData ? <h3>Loading...</h3> :
                <div className="col-12 h-100 bg-light py-4">
                    <div className="col-12 h-100 bg-white rounded-1 p-3 shadow-sm border border-light-subtle position-relative ">
                        <PageHeader text="Employees" className="text-center pb-3" />

                        <dev className="position-absolute top-0 start-0 m-3">
                            <Button color="primary" outline size="sm" className="me-2"><ArrowClockwise size={24} /></Button>
                            <Button color="primary" outline size="sm" className="me-2" onClick={onNewEmployee}><Plus size={24} /></Button>

                            {/* <Input
                                id="search"
                                name="search"
                                placeholder="Search"
                                type="search"
                                className="display-inline align-middle"
                                style={{width:'300px'}}
                            /> */}

                        </dev>

                        <ButtonGroup className="position-absolute top-0 end-0 m-3">
                            <Pagination />
                        </ButtonGroup>


                        <Table
                            bordered
                            hover
                            responsive
                            className="m-0 p-0"

                        >
                            <thead class="table-light">
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