from sqlalchemy.orm import Session
from sqlalchemy import or_
import models, schemas
from fastapi import HTTPException

def get_records(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    query = db.query(models.FinancialRecord).filter(models.FinancialRecord.is_deleted == False)
    if search:
        query = query.filter(
            or_(
                models.FinancialRecord.category.ilike(f"%{search}%"),
                models.FinancialRecord.notes.ilike(f"%{search}%")
            )
        )
    return query.order_by(models.FinancialRecord.date.desc()).offset(skip).limit(limit).all()

def create_record(db: Session, record: schemas.RecordCreate, user_id: int):
    db_record = models.FinancialRecord(**record.model_dump(), owner_id=user_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: int):
    record = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id).first()
    if not record or record.is_deleted:
        raise HTTPException(status_code=404, detail="Record not found")
    
    record.is_deleted = True
    db.commit()
    return {"message": "Record successfully deleted"}

def update_record(db: Session, record_id: int, record: schemas.RecordUpdate):
    db_record = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id).first()
    if not db_record or db_record.is_deleted:
        raise HTTPException(status_code=404, detail="Record not found")
    
    update_data = record.model_dump()
    for key, value in update_data.items():
        setattr(db_record, key, value)
        
    db.commit()
    db.refresh(db_record)
    return db_record