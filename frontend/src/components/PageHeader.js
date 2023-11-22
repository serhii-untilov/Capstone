export default function PageHeader({...props}) {
    const className = "text-body text-center pt-3 pb-2 " + props.className

    return <h4 {...props} className={className}>{props.text}</h4>
}