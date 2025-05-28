from sqlalchemy import Column, Integer, String, Date
from app.database.models.base import Base

class DailyPostInsight(Base):
    __tablename__ = "daily_post_insight"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    post_id = Column(String, nullable=False)
    media_type = Column(String, nullable=False)

    reach = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)