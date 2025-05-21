from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.services.instagram_account_service import list_instagram_accounts
from app.schemas.instagram_account_schema import InstagramAccountResponse
from app.database.session import get_db

router = APIRouter()

@router.get("/ping")
def ping():
    return {"message": "pong"}

@router.get("/instagram/accounts", response_model=List[InstagramAccountResponse])
def get_instagram_accounts(db: Session = Depends(get_db)):
    return list_instagram_accounts(db)
