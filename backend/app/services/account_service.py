from sqlalchemy.orm import Session
from app.schemas.account_schema import AccountCreate
from app.database.model.models import Account
from app.database.repositories.account_repo import create_account

def create_account_service(db: Session, account_in: AccountCreate) -> Account:
    # ここで追加のバリデーションやロジックを実装可能
    return create_account(db, account_in)
