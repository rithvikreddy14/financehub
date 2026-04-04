from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import models, schemas, dependencies
from services import user_service

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserRoleUpdate(BaseModel):
    role: schemas.RoleEnum

class UserStatusUpdate(BaseModel):
    is_active: bool

@router.get("/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(dependencies.get_db), current_user = Depends(dependencies.require_admin)):
    return user_service.get_users(db, skip=skip, limit=limit)

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user = Depends(dependencies.get_current_user)):
    return current_user

@router.put("/{user_id}/role")
def update_user_role(user_id: int, payload: UserRoleUpdate, db: Session = Depends(dependencies.get_db), current_user = Depends(dependencies.require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.role = payload.role
    db.commit()
    return {"message": "Role updated"}

@router.put("/{user_id}/status")
def update_user_status(user_id: int, payload: UserStatusUpdate, db: Session = Depends(dependencies.get_db), current_user = Depends(dependencies.require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.is_active = payload.is_active
    db.commit()
    return {"message": "Status updated"}