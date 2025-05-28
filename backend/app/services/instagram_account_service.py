from sqlalchemy.orm import Session
from app.database.repositories.instagram_account_repository import InstagramAccountRepository
from app.schemas.instagram_account_schema import InstagramAccountResponse
from typing import List

def list_instagram_accounts(db: Session) -> List[InstagramAccountResponse]:
    repo = InstagramAccountRepository(db)
    accounts = repo.get_all_accounts()
    return [InstagramAccountResponse.from_orm(account) for account in accounts]
