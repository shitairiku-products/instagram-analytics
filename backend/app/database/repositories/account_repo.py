from sqlalchemy.orm import Session
from app.database.model.models import Account
from app.schemas.account_schema import AccountCreate

def create_account(db: Session, account_in: AccountCreate) -> Account:
    account = Account(
        long_lived_access_token=account_in.long_lived_access_token,
        ig_id=account_in.ig_id,
        username=account_in.username,
        account_type=account_in.account_type,
        profile_picture_url=account_in.profile_picture_url,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account
