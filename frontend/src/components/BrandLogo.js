export default function BrandLogo(args) {
    return (
        <img
            {...args}
            src = {window.location.origin + '/payroll.png'}
            alt="" 
            height="32"
        />
    )
}