from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
import models, schemas, security, dependencies
from services import user_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(dependencies.get_db)):
    
    print("--------------------------------------------------")
    print(f"👉 1. LOGIN RECEIVED: frontend sent username/email = '{form_data.username}'")
    print(f"👉 2. LOGIN RECEIVED: frontend sent password = '{form_data.password}'")
    
    # Try to find the user
    user = db.query(models.User).filter(
        or_(
            models.User.username == form_data.username,
            models.User.email == form_data.username
        )
    ).first()
    
    if not user:
        print("❌ 3. RESULT: User NOT FOUND in database!")
        print("--------------------------------------------------")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    print(f"✅ 3. RESULT: User found! DB Username: '{user.username}', DB Email: '{user.email}'")
    
    # Check the password
    is_password_correct = security.verify_password(form_data.password, user.hashed_password)
    print(f"👉 4. PASSWORD CHECK: Is password correct? {is_password_correct}")
    print("--------------------------------------------------")
    
    if not is_password_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    print(f"📝 REGISTERING NEW USER: {user.username} / {user.email}")
    return user_service.create_user(db=db, user=user)