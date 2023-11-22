import { Button } from "reactstrap"

export default function _Button({...props}) {
    props.className = (props.className || "") + " bg-gradient shadow-sm border"
    // return <Button {...props} color="light"></Button>
    return <Button {...props} color="primary"></Button>
}