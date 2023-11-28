import { DropdownToggle as RsDropdownToggle } from "reactstrap"

export function DropdownToggle({...props}) {
    const className = (props.className || "") + " bg-gradient shadow-sm border"
    return <RsDropdownToggle {...props} className={className} />
}

