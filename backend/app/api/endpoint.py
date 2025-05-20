from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from app.schemas.account_schema import AccountCreate, AccountRead
from app.services.account_service import create_account_service
from app.database.session import get_db
router = APIRouter()

@router.post("/accounts", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(account_in: AccountCreate, db: Session = Depends(get_db)):
    try:
        account = create_account_service(db, account_in)
        return account
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


from app.services.meta_api_service import fetch_instagram_account_info
from app.schemas.account_schema import AccountCreate

@router.post("/accounts/fetch", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def fetch_and_create_account(db: Session = Depends(get_db)):
    try:
        info = fetch_instagram_account_info()
        account_in = AccountCreate(
            long_lived_access_token=os.getenv("META_ACCESS_TOKEN"),
            ig_id=info["id"],
            username=info["username"],
            account_type=info["account_type"],
            profile_picture_url=info.get("profile_picture_url")
        )
        account = create_account_service(db, account_in)
        return account
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
