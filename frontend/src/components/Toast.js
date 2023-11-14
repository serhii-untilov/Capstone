import { useState } from "react"
import { Alert, Toast, ToastBody, ToastHeader } from "reactstrap"

export default function _Toast({ ...props }) {
    const [messages, setMessages] = useState(props.messages ? [...props.messages] : [])
    return messages.length ? (
        <Toast className="p-3 m-3 rounded position-absolute top-0 end-0" isOpen={true}>
            <ToastHeader icon="warning" toggle={function noRefCheck() {
                setMessages([])
            }}>
                {props.title || ''}
            </ToastHeader>
            <ToastBody>
                asdfasdfasdfasdfaf
            </ToastBody>
        </Toast>
    ) : null
}