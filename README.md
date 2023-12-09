# Payroll for Small and Medium Business

## Distinctiveness

The Payroll SMB application provides a **solution for employers and employees to calculate salary** and taxes based on laws for chosen country.

## Complexity

This project uses:
  - 14 Django models
  - Django Rest Framework for Backend
  - React.js for frontend, 15 interface pages
  - Bootstrap 5 as a CSS library
  - User authentication and JWT
  - Axios HTTP Client to make requests to a REST API on the backend server
  - React Router to organize frontend pages, routes and make context

## Files and directory structure

|File / directory        |Description|
|-------------------------|-----------|
|backend                  |Django project configuration directory|
|frontend                 |Frontend application directory|
|frontend\public          |images, favicon, logo|
|frontend\src             |source files directory for frontend|
|frontend\src\api\index.js|Axios config, and hooks, JWT config|
|frontend\src\components  |React components: Sidenav, Button, PageHeader, Toast, etc.|
|frontend\src\context     |React context providers for Auth, Company, User entities|
|frontend\src\pages       |Frontend pages: Register, Login, Company, Employees, Payroll, etc.|
|frontend\src\router      |Frontend routes config, Wrappers for the different access scenarios|
|frontend\src\services    |Service interface between interface data components and Axios REST API|
|frontend\src\services\authService.js|Auth service|
|frontend\src\services\dateService.js|Functions to handle formatting and convert date and dateTime data types|
|frontend\src\App.js     |Frontend application main file|
|frontend\src\index.js   |React.js application entrypoint file|
|frontend\src\styles.css |Main style sheet file|
|frontend\\.gitignore |Lis of files and directories to skip in git synchronization|****
|frontend\package.json |Frontend application config file for npm |
|payroll          |Backend Django Rest Framework application directory|
|payroll\lib\date_utils.py|Functions to manipulate with date and dataTime data types - format, convert, etc|
|payroll\lib\run_payroll.py|Functions and procedures to calculate payroll for employees and companies|
|payroll\migrations|Files for creating a database structure and filling tables|
|payroll\models.py|Descripes DB structure|
|payroll\serializers.py|Describes physical and virtual entity attributes for endpoints|
|payroll\tests.py|Some tests|
|payroll\urls.py|Routes config|
|payroll\views.py|Endpoints definitions|
|install.sh       |bash script to install development environment (python, pip, nodejs, mkdir, git clone project)|
|start.sh         |bash script to start application - starts the backend and the frontend simultaneously|
|requirements.txt |list of the backend components

## Getting Started

To run the application host machine must have a development environment for Python and JavaScript. If it is not, try to install it:

``` bash
./install.sh
```

## To run application

In the project directory, you can run application:

``` bash
./start.sh
```

This script will launch the backend and the frontend applications simultaneously.

## Additional information

Another method to launch the application:

launch the backend:

``` bash
python -m venv .venv
source ./.venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

and then launch the frontend:

``` bash
cd ./frontend
npm install
npm start
```

## Scenario

### 1. Register as a new user

   In the Register form enter *email*, *password*, select the *user role: Employer* and push the Register button.

### 2. Create a Company

  In the left side bar choose *Company - Create a new company*.
  On the new company form enter


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
- SideNav bar (see Site map for the Employer and Employee pages)
