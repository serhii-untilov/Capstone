import { Button } from "reactstrap"

export default function _Button({...props}) {
    const className = (props.className || "") + " bg-gradient shadow-sm border"
    // return <Button {...props} color="primary"></Button>
    return <Button {...props} className={className}></Button>
}

