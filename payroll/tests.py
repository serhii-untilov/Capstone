from django.test import TestCase
from datetime import date
from payroll.lib.date_utils import date_to_str, str_to_date, month_begin, month_end

class DateTestCase(TestCase):

    def test_str_to_date(self):
        """test str_to_date"""
        d = str_to_date('2023-12-06')
        self.assertEqual(d.day, 6)
        self.assertEqual(d.month, 12)
        self.assertEqual(d.year, 2023)

    def test_date_to_str(self):
        """test date_to_str"""
        d = date(2023, 12, 6)
        s = date_to_str(d)
        self.assertEqual(s, '2023-12-06')

    def test_month_begin(self):
        """test month_begin"""
        d = month_begin(date(2023, 12, 6))
        self.assertEqual(d.day, 1)
        self.assertEqual(d.month, 12)
        self.assertEqual(d.year, 2023)

    def test_month_end(self):
        """test month_end"""
        d = month_end(date(2023, 12, 6))
        self.assertEqual(d.day, 31)
        self.assertEqual(d.month, 12)
        self.assertEqual(d.year, 2023)

    def test_str_month_end(self):
        d = str_to_date('2023-12-06')
        d = month_begin(d)
        d = month_end(d)
        s = date_to_str(d)
        self.assertEqual(s, '2023-12-31')