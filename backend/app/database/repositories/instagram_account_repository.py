from sqlalchemy.orm import Session
from app.database.models.instagram_account_model import InstagramAccount
from typing import List

class InstagramAccountRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_accounts(self) -> List[InstagramAccount]:
        return self.db.query(InstagramAccount).all()