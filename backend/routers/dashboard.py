from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schemas, dependencies
from services import dashboard_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=schemas.DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.get_current_user) # All authenticated users can view
):
    return dashboard_service.get_summary(db)