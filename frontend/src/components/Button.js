import { Button as RsButton } from "reactstrap"

export function Button({...props}) {
    const className = (props.className || "") + " bg-gradient shadow-sm border"
    // return <Button {...props} color="primary"></Button>
    return <RsButton {...props} className={className}></RsButton>
}

