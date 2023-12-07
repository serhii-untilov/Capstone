from decimal import *
from payroll.models import PaymentType, Company, Employee, Payroll, PayrollDetails
from payroll.lib.date_utils import str_to_date, month_end, date_to_str


class Period:
    def __init__(self, date_begin, date_end):
        self.date_begin = date_begin
        self.date_end = date_end

    def __str__(self):
        return f'Period: {self.date_begin} - {self.date_end}'


class Context:
    def __init__(self, company, pay_period):
        self.company = company
        self.pay_period = pay_period
        self.paymentTypes = array_to_dictionary(PaymentType.objects.all())
        self.save_if_zero = ['Wage']

    def get_earnings(self):
        return [x for x in self.paymentTypes if self.paymentTypes[x].class_name == 'Earnings']

    def __str__(self):
        return f'Context {self.company.name} {self.pay_period}'


def run_payroll_company(company_id, pay_period):
    print('run_payroll_company')
    company = Company.objects.get(pk=company_id)
    pay_period = Period(str_to_date(pay_period),
                    month_end(str_to_date(pay_period)))
    context = Context(company, pay_period)
    employees = get_employees(company, pay_period)
    details = []
    for employee in employees:
        details.extend(calc_payroll_details(context, employee))
    delete_details(context, employees)
    save_details(context, details)
    payrolls = calc_payroll(context, employees, details)
    delete_payroll(context, employees)
    save_payroll(payrolls)


def run_payroll_employee(employee_id, pay_period):
    print('run_payroll_employee')
    employee = Employee.objects.get(pk=employee_id)
    company = Company.objects.get(pk=employee.company_id)
    pay_period = Period(str_to_date(pay_period),
                    month_end(str_to_date(pay_period)))
    context = Context(company, pay_period, employee)
    employee_details = calc_payroll_details(context, employee)
    delete_details(context, [employee])
    save_details(context, employee_details)

    employees = get_employees(context.company, context.pay_period)
    details = get_payroll_details(company, pay_period)
    payrolls = calc_payroll(context, employees, details)
    delete_payroll(context, employees)
    save_payroll(payrolls)


def array_to_dictionary(arr):
    res_dict = {}
    for i in range(0, len(arr)):
        res_dict[arr[i].id] = arr[i]
    return res_dict


def get_employees(company, pay_period):
    return Employee.objects.filter(company_id=company.id,
                                   date_from__lte=date_to_str(
                                       pay_period.date_end),
                                   date_to__gte=date_to_str(pay_period.date_begin),
                                   is_deleted=False,
                                   person__deleted__gte=date_to_str(pay_period.date_end))


def get_payroll_details(company, pay_period):
    employees = get_employees(company, pay_period)
    details = []
    for employee in employees:
        employee_details = PayrollDetails.objects.filter(
            employee_id=employee.id, pay_period=date_to_str(pay_period.date_begin))
        details.extend(employee_details)
    return details


def delete_details(context, employees):
    for employee in employees:
        PayrollDetails.objects.filter(
            employee_id=employee.id,
            pay_period=date_to_str(context.pay_period.date_begin)
        ).delete()


def save_details(context, details):
    for detail in details:
        if detail.amount or context.paymentTypes[detail.payment_type_id].method in context.save_if_zero:
            detail.save()


def delete_payroll(context, employees):
    for employee in employees:
        Payroll.objects.filter(
            employee_id=employee.id,
            pay_period=date_to_str(context.pay_period.date_begin)
        ).delete()


def save_payroll(payrolls):
    for payroll in payrolls:
        payroll.save()


def sum_amount(context, details, group):
    amount = 0
    for d in details:
        if context.paymentTypes[d.payment_type_id].group == group:
            amount = amount + d.amount
    return amount


def calc_payroll(context, employees, details):
    payrolls = []
    for employee in employees:
        employee_details = [x for x in details if x.employee_id == employee.id]
        record = Payroll(
            employee_id=employee.id,
            pay_period=date_to_str(context.pay_period.date_begin),
            days=0,
            hours=0,
            wage=sum_amount(context, employee_details, 'Earnings'),
            bonus=sum_amount(context, employee_details, 'Bonus'),
            taxes=sum_amount(context, employee_details, 'Taxes'),
            deductions=sum_amount(
                context, employee_details, 'Deductions'),
            payments=sum_amount(context, employee_details, 'Payments'),
        )
        payrolls.append(record)
    return payrolls


def calc_payroll_details(context, employee):
    employee_details = []
    print('calc_payroll_details', context, employee)
    employee_details.extend(calc_wage(context, employee))
    employee_details.extend(calc_personal_income_tax(
        context, employee, employee_details))
    employee_details.extend(calc_military_collection(
        context, employee, employee_details))
    return employee_details


def calc_wage(context, employee):
    record = PayrollDetails(
        employee_id=employee.id,
        pay_period=date_to_str(context.pay_period.date_begin),
        date_from=date_to_str(context.pay_period.date_begin),
        date_to=date_to_str(context.pay_period.date_end),
        payment_type_id=1,
        days=0,
        hours=0,
        amount=employee.wage
    )
    return [record]


def calc_personal_income_tax(context, employee, employee_details):
    income = 0
    earnings = context.get_earnings()
    for d in employee_details:
        if d.payment_type_id in earnings:
            income = income = income + d.amount
    record = PayrollDetails(
        employee_id=employee.id,
        pay_period=date_to_str(context.pay_period.date_begin),
        date_from=date_to_str(context.pay_period.date_begin),
        date_to=date_to_str(context.pay_period.date_end),
        payment_type_id=4,
        days=0,
        hours=0,
        amount=round(income * Decimal(0.18), 2)
    )
    return [record]


def calc_military_collection(context, employee, employee_details):
    income = 0
    earnings = context.get_earnings()
    for d in employee_details:
        if d.payment_type_id in earnings:
            income = income = income + d.amount
    record = PayrollDetails(
        employee_id=employee.id,
        pay_period=date_to_str(context.pay_period.date_begin),
        date_from=date_to_str(context.pay_period.date_begin),
        date_to=date_to_str(context.pay_period.date_end),
        payment_type_id=5,
        days=0,
        hours=0,
        amount=round(income * Decimal(0.015), 2)
    )
    return [record]
