# day44_payroll.py
# Payroll for different kinds of employee, using inheritance.


class Employee:
    def __init__(self, emp_id, name):
        self.emp_id = emp_id
        self.name = name

    def monthly_pay(self):
        raise NotImplementedError("Subclasses must define monthly_pay")

    def role(self):
        return type(self).__name__.replace("Employee", "").lower() or "employee"

    def __repr__(self):
        return f"{type(self).__name__}({self.emp_id}, {self.name!r})"


class SalariedEmployee(Employee):
    def __init__(self, emp_id, name, annual_salary):
        super().__init__(emp_id, name)
        self.annual_salary = annual_salary

    def monthly_pay(self):
        return self.annual_salary / 12


class HourlyEmployee(Employee):
    OVERTIME_AFTER = 160          # hours per month
    OVERTIME_RATE = 1.5

    def __init__(self, emp_id, name, hourly_rate, hours=0):
        super().__init__(emp_id, name)
        self.hourly_rate = hourly_rate
        self.hours = hours

    def monthly_pay(self):
        regular = min(self.hours, self.OVERTIME_AFTER)
        overtime = max(0, self.hours - self.OVERTIME_AFTER)
        return (regular + overtime * self.OVERTIME_RATE) * self.hourly_rate


class CommissionEmployee(SalariedEmployee):
    def __init__(self, emp_id, name, annual_salary, sales=0, rate=0.05):
        super().__init__(emp_id, name, annual_salary)
        self.sales = sales
        self.rate = rate

    def monthly_pay(self):
        return super().monthly_pay() + self.sales * self.rate


class Manager(SalariedEmployee):
    BONUS_PER_REPORT = 150

    def __init__(self, emp_id, name, annual_salary):
        super().__init__(emp_id, name, annual_salary)
        self.team = []

    def add_report(self, employee):
        self.team.append(employee)

    def monthly_pay(self):
        return super().monthly_pay() + self.BONUS_PER_REPORT * len(self.team)


def run_payroll(employees):
    print(f"{'ID':<5}{'Name':<14}{'Role':<12}{'Monthly pay':>12}")
    print("-" * 43)
    total = 0
    for e in sorted(employees, key=lambda e: e.monthly_pay(), reverse=True):
        pay = e.monthly_pay()
        total += pay
        print(f"{e.emp_id:<5}{e.name:<14}{e.role():<12}{pay:>12,.2f}")
    print("-" * 43)
    print(f"{'Total':<31}{total:>12,.2f}")


def main():
    amina = Manager(1, "Amina", 72_000)
    omar = SalariedEmployee(2, "Omar", 48_000)
    sara = HourlyEmployee(3, "Sara", 22.50, hours=172)
    yusuf = CommissionEmployee(4, "Yusuf", 30_000, sales=41_000)
    for person in (omar, sara, yusuf):
        amina.add_report(person)

    run_payroll([amina, omar, sara, yusuf])
    print(f"\n{amina.name} manages: {amina.team}")
    print("Is Yusuf salaried?", isinstance(yusuf, SalariedEmployee))


if __name__ == "__main__":
    main()
