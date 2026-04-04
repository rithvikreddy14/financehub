from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date
from models import RoleEnum, RecordTypeEnum

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: RoleEnum = RoleEnum.viewer

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class RecordBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: RecordTypeEnum
    category: str
    date: date
    notes: Optional[str] = None

class RecordCreate(RecordBase):
    pass

# FIX: RecordUpdate now strictly inherits from RecordBase
class RecordUpdate(RecordBase):
    pass

class RecordResponse(RecordBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class MonthlyTrend(BaseModel):
    name: str
    income: float
    expenses: float

class DashboardSummary(BaseModel):
    net_balance: float
    total_income: float
    total_expense: float
    expense_by_category: dict[str, float]
    monthly_trends: List[MonthlyTrend]