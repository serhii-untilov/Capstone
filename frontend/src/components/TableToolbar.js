import { useState } from "react";
import { ArrowClockwise, Plus } from "react-bootstrap-icons";
import { Button, Input } from "reactstrap";

export function TableToolbar({...props}) {
    const { onRefresh, onAdd, onSearch, className } = props
    const [search, setSearch] = useState('')

    const onChangeSearch = (event) => {
        setSearch(event.target.value)
        onSearch(event.target.value)
    }

    return (
        <>
            {/* <dev className="position-absolute top-0 start-0 m-3"> */}
            <dev className={className}>
                {onRefresh ?
                <Button color="primary" outline size="sm" className="me-2" onClick={onRefresh}><ArrowClockwise size={22} /></Button>
                : null }
                {onAdd ?
                <Button color="primary" outline size="sm" className="me-2" onClick={onAdd}><Plus size={22} /></Button>
                : null }

                {onSearch ? <Input
                                id="search"
                                name="search"
                                placeholder="Search"
                                type="search"
                                value={search || ''}
                                onChange={onChangeSearch}
                                className="display-inline align-middle"
                                style={{width:'300px'}}
                            />
                        : null }

            </dev>
            {/* </dev> */}
        </>
    )
}
