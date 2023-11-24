import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function _Pagination() {
    return (
        <>
            <Pagination aria-label="Page navigation example">
                <PaginationItem disabled>
                    <PaginationLink
                        first
                        href="#"
                    />
                </PaginationItem>
                <PaginationItem disabled>
                    <PaginationLink
                        href="#"
                        previous
                    />
                </PaginationItem>
                <PaginationItem active>
                    <PaginationLink href="#">
                        1
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem disabled>
                    <PaginationLink
                        href="#"
                        next
                    />
                </PaginationItem>
                <PaginationItem disabled>
                    <PaginationLink
                        href="#"
                        last
                    />
                </PaginationItem>
            </Pagination>
        </>
    )
}