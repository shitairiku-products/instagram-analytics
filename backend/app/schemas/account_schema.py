from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccountBase(BaseModel):
    long_lived_access_token: str
    ig_id: str
    username: str
    account_type: str
    profile_picture_url: Optional[str] = None

class AccountCreate(AccountBase):
    pass

class AccountRead(AccountBase):
    id: int
    fetched_at: datetime

    class Config:
        orm_mode = True
