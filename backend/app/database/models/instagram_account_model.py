from sqlalchemy import Column, Integer, String, DateTime
from app.database.models.base import Base
from datetime import datetime, timezone

class InstagramAccount(Base):
    __tablename__ = "instagram_account"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    profile_picture_url = Column(String)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    media_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
