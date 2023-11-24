import { Button, ButtonGroup, Table } from "reactstrap";
import PageHeader from "../components/PageHeader";
import { Plus } from "react-bootstrap-icons";
import Pagination from "../components/Pagination"

export default function Employees() {
    return (
        <>
            <div className="col-12 h-100 bg-light py-4">
                <div className="col-12 h-100 bg-white rounded-1 p-3 shadow-sm border border-light-subtle position-relative ">
                    <PageHeader text="Employees" className="text-center pb-3" />

                    <ButtonGroup className="position-absolute top-0 start-0 m-3">
                        <Button color="primary" outline size="sm" ><Plus size={24} /></Button>
                    </ButtonGroup>

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
                                <th>
                                    #
                                </th>
                                <th className="lg">
                                    First Name
                                </th>
                                <th>
                                    Last Name
                                </th>
                                <th>
                                    Username
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    1
                                </th>
                                <td>
                                    Mark
                                </td>
                                <td>
                                    Otto
                                </td>
                                <td>
                                    @mdo
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    2
                                </th>
                                <td>
                                    Jacob
                                </td>
                                <td>
                                    Thornton
                                </td>
                                <td>
                                    @fat
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    3
                                </th>
                                <td>
                                    Larry
                                </td>
                                <td>
                                    the Bird
                                </td>
                                <td>
                                    @twitter
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}