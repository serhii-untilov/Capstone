import { Button } from "reactstrap"

export default function _Button({...props}) {
    if (!props.className || !props.className.includes("bg-gradient")) {
        props.className = (props.className || "") + " bg-gradient"
    }
    return <Button {...props} ></Button>
}