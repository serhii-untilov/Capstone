import { DropdownToggle } from "reactstrap"

export default function _DropdownToggle({...props}) {
    const className = (props.className || "") + " bg-gradient shadow-sm border"
    return <DropdownToggle {...props} className={className} />
}

