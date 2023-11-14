export default function PageHeader({...props}) {
    return <h2 {...props} className="text-body-secondary py-2">{props.text}</h2>
}