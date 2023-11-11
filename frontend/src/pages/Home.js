export default function Home() {
    return (
        <>
        <h2 class="text-center py-1 text-body-secondary">Welcome to Payroll SMB</h2>
            <h3 class="text-center py-2">Payroll Solutions to Small and Medium Business</h3>
        <div class="row">
        <div class="col-lg-6 col-sm-12 py-3">
            <h4>What we offer</h4>
            <ul>
                <li class="py-2">Managing of payroll accounting policy of the company</li>
                <li class="py-2">Maintaining proper employee records</li>
                <li class="py-2">Calculating the right deductions and taxes</li>
                <li class="py-2">Handling employee benefits</li>
                <li class="py-2">Staying compliant with federal and state government regulations</li>
            </ul>
        </div>

        <div class="col-lg-6 col-sm-12 py-3">
        <h4>The purpose</h4>

            <p>The <strong>Payroll SMB</strong> application is designed <strong>to calculate wages</strong> to employees.</p>
            <p>The users of the application are divided into two categories - employers and employees.</p>
            <p>Each category has a user role. User role is defined during user registration.</p>
            <p>According to the user's role, the program provides access to information about the input data and results of payroll, as well as the functions of calculating and paying wages to employees.</p>
        </div>

        <div class="col-lg-6 col-sm-12 py-3">
        <h4>Employers</h4>

            <p>They register the Company, form a staff list, form employee cards and assign them to positions.</p>
            <p>For each employee, the payment system (hourly or monthly), the amount of payment, the taxation system, the parameters of salary payment (bank, recipient's current account) are determined.</p>
            <p>Salary is calculated automatically.</p>
            <p>Wages are paid by transferring the lists of employees and the amount "To be paid" to bank institutions, according to the information about the payment in the employees' cards.</p>
        </div>
        <div class="col-lg-6 col-sm-12 py-3">
        <h4>Employees</h4>

            <p>The user has the opportunity to view his personal account and salary statement.</p>
            <p>The user's account is connected to the personal account of the payroll register after confirmation by e-mail. The key to connection is the employee's email address. Therefore, when registering, the user indicates his email.</p>
        </div>
        </div>

        <div class="text-center">
            <h4>To start</h4>
            <button className="btn btn-primary bg-gradient">Register</button> or <button className="btn btn-primary bg-gradient">Login</button>
        </div>
        </>

    )
}