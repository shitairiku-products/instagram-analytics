from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InstagramAccountResponse(BaseModel):
    id: int
    username: str
    profile_picture_url: Optional[str] = None
    followers_count: int
    following_count: int
    media_count: int
    created_at: datetime

    class Config:
        orm_mode = True  # Allows conversion from SQLAlchemy to Pydantic