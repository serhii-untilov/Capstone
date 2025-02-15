import { Pagination as RsPagination, PaginationItem, PaginationLink } from "reactstrap";

export function Pagination() {
    return (
        <>
            <RsPagination className="m-0 p-0">
                <PaginationItem disabled className="bg-gradient shadow-sm">
                    <PaginationLink
                        first
                        href="#"
                    />
                </PaginationItem>
                <PaginationItem disabled className="bg-gradient shadow-sm">
                    <PaginationLink
                        href="#"
                        previous
                    />
                </PaginationItem>
                <PaginationItem active className="bg-gradient shadow-sm">
                    <PaginationLink href="#">
                        1
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem disabled className="bg-gradient shadow-sm">
                    <PaginationLink
                        href="#"
                        next
                    />
                </PaginationItem>
                <PaginationItem disabled className="bg-gradient shadow-sm">
                    <PaginationLink
                        href="#"
                        last
                    />
                </PaginationItem>
            </RsPagination>
        </>
    )
}