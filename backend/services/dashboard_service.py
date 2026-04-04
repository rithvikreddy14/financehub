from sqlalchemy.orm import Session
from sqlalchemy import func
import models
from collections import defaultdict
from datetime import datetime
import calendar

def get_summary(db: Session):
    totals = db.query(
        models.FinancialRecord.type,
        func.sum(models.FinancialRecord.amount).label("total")
    ).filter(models.FinancialRecord.is_deleted == False).group_by(models.FinancialRecord.type).all()

    income = next((t.total for t in totals if t.type == models.RecordTypeEnum.income), 0.0)
    expense = next((t.total for t in totals if t.type == models.RecordTypeEnum.expense), 0.0)

    categories = db.query(
        models.FinancialRecord.category,
        func.sum(models.FinancialRecord.amount).label("total")
    ).filter(
        models.FinancialRecord.type == models.RecordTypeEnum.expense,
        models.FinancialRecord.is_deleted == False
    ).group_by(models.FinancialRecord.category).all()

    # Calculate Monthly Trends (Last 6 months simplified)
    records = db.query(models.FinancialRecord).filter(models.FinancialRecord.is_deleted == False).all()
    trends = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})
    
    for r in records:
        month_name = calendar.month_abbr[r.date.month]
        if r.type == models.RecordTypeEnum.income:
            trends[month_name]["income"] += r.amount
        else:
            trends[month_name]["expenses"] += r.amount

    monthly_trends = [{"name": k, "income": v["income"], "expenses": v["expenses"]} for k, v in trends.items()]

    return {
        "net_balance": income - expense,
        "total_income": income,
        "total_expense": expense,
        "expense_by_category": {c.category: c.total for c in categories},
        "monthly_trends": monthly_trends # <--- ADD THIS
    }