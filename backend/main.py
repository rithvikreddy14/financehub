import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth, users, records, dashboard

# Create database tables automatically on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinanceHub API")

# Get frontend URL from Render environment variables, fallback to localhost
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Configure CORS for Production and Localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all application routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(records.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"status": "online", "message": "Welcome to the FinanceHub API"}