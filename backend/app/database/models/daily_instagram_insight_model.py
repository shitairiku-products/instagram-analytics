from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database.models.base import Base

class DailyInstagramInsight(Base):
    __tablename__ = "daily_instagram_insight"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    media_type = Column(String, nullable=False)

    new_followers = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    profile_visits = Column(Integer, default=0)
    website_clicks = Column(Integer, default=0)

    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)

    company_id = Column(Integer, ForeignKey("instagram_account.id"))