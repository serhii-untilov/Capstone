import { Toast as RsToast, ToastBody, ToastHeader } from "reactstrap"

export function Toast({ ...props }) {
    return (
            <div className=" p-3 m-3 position-absolute top-0 end-0">
                <RsToast className="row p-1 m-1 rounded" isOpen={!!props.messages.length}>
                    <ToastHeader icon={props.icon || "danger"} toggle={props.close}>
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
                </RsToast>
            </div >
    )
}