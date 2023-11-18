import { Toast, ToastBody, ToastHeader } from "reactstrap"

export default function _Toast({ ...props }) {
    return (
            <div className=" p-3 m-3 position-absolute top-0 end-0">
                <Toast className="row p-1 m-1 rounded" isOpen={!!props.messages.length}>
                    <ToastHeader icon={props.icon || "warning"} toggle={props.close}>
                        {props.title || "Warning"}
                    </ToastHeader>
                    <ToastBody>
                        {props.messages.length > 1 ?
                            <ul>
                                {props.messages.map((m, i) => {
                                    return <li>{m}</li>
                                })}
                            </ul>
                            : <p>{props.messages[0]}</p>
                        }
                    </ToastBody>
                </Toast>
            </div >
    )
}