# Getting Started with Payroll Application

## To run application

In the project directory, you can run application:
```
./start
```

## The purpose of application

The **Payroll application** is designed for **calculating wages**.

The users of the application are divided into two categories - employers and employees.

Each category has a user role. User role is defined during user registration.

According to the user's role, the program provides access to information about the input data and results of payroll, as well as the functions of calculating and paying wages to employees.

### Users with the role "Employers"

They register the enterprise, form a staff list, form employee cards and assign them to positions.

For each employee, the payment system (hourly or monthly), the amount of payment, the taxation system, the parameters of salary payment (bank, recipient's current account) are determined.

Salary is calculated automatically.

Wages are paid by transferring the lists of employees and the amount "To be paid" to bank institutions, according to the information about the payment in the employees' cards.

### Users with the role "Employees"

The user has the opportunity to view his personal account and salary statement.

The user's account is connected to the personal account of the payroll register after confirmation by e-mail. The key to connection is the employee's email address. Therefore, when registering, the user indicates his email.

## Site map
- **Home** page
  - About application
  - Advantages
    - for employers
    - for employees
  - Login
  - Register
- **Employer** page
  - Dashboard
  - Staff list
  - Employees
  - Payroll sheet
  - Settings
  - Logout
- **Employee** page
  - Personal card
  - Payroll
  - Logout

## Main menu
- Horizontal menu bar
  - Logo and application's name - Payroll
  - Name of the selected company and menu of companies that user has access
  - Link to Home page
  - Link to Register page
  - Link to SignIn page
  - Link to SignOut
  - Language menu
  - Link to User's profile
- Sidenav bar (see Site map for the Employer and Employee pages)

## To run application

In the project directory, you can run application:
```
./start
```
