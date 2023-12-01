export function AdditionalActions({ props, children }) {
    const className = (props?.className || '') + "p-3 m-3 position-absolute top-0 end-0"
    return (
        <div {...props} className={className}>
            <div className="row shadow-sm border border-light-subtle p-3 rounded-1 m-auto bg-white">
                {children}
            </div>
        </div >
    )
}