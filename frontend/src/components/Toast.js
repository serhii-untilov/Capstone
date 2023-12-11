import { Toast as RsToast, ToastBody, ToastHeader } from "reactstrap"

export function Toast({ ...props }) {
    const { messages, icon, title, close } = props
    return (
            <div className=" p-3 m-3 position-absolute top-0 end-0">
                <RsToast className="row p-1 m-1 rounded" isOpen={!!messages.length}>
                    <ToastHeader icon={icon || "danger"} toggle={close}>
                        {title || "Warning"}
                    </ToastHeader>
                    <ToastBody>
                        {messages.length > 1 ?
                            <ul>
                                {messages.map((m, i) => {
                                    return <li>{m}</li>
                                })}
                            </ul>
                            : <p>{messages[0]}</p>
                        }
                    </ToastBody>
                </RsToast>
            </div >
    )
}