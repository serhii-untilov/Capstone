from datetime import datetime, timedelta

# date to 'YYYY-MM-DD'
def date_to_str(d):
    return d.isoformat()

# 'YYYY-MM-DD' to date
def str_to_date(s):
    return datetime.strptime(s, '%Y-%m-%d').date()


def month_begin(d):
    return d.replace(day=1)

def month_end(d):
    next_month = d.replace(day=28) + timedelta(days=4)
    return next_month - timedelta(days=next_month.day)
