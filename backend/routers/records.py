from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas, dependencies
from services import record_service

router = APIRouter(prefix="/api/records", tags=["Financial Records"])

@router.get("/", response_model=List[schemas.RecordResponse])
def read_records(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.require_analyst)
):
    return record_service.get_records(db, skip=skip, limit=limit, search=search)

@router.post("/", response_model=schemas.RecordResponse)
def create_record(
    record: schemas.RecordCreate, 
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.require_admin)
):
    return record_service.create_record(db, record, user_id=current_user.id)

@router.put("/{record_id}", response_model=schemas.RecordResponse)
def update_record(
    record_id: int,
    record: schemas.RecordUpdate,
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.require_admin)
):
    return record_service.update_record(db, record_id, record)

@router.delete("/{record_id}")
def delete_record(
    record_id: int, 
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.require_admin)
):
    return record_service.delete_record(db, record_id)