from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.model.base import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    long_lived_access_token = Column(String, nullable=False)
    ig_id = Column(String, nullable=False, unique=True)
    username = Column(String, nullable=False)
    account_type = Column(String, nullable=False)
    profile_picture_url = Column(String, nullable=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

    insight_snapshots = relationship("InsightSnapshot", back_populates="company")


class InsightSnapshot(Base):
    __tablename__ = "insight_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    date = Column(Date, nullable=False)

    # --- アカウント全体指標 ---
    followers_count = Column(Integer, nullable=True)
    media_count = Column(Integer, nullable=True)
    reach = Column(Integer, nullable=True)
    impressions = Column(Integer, nullable=True)
    profile_visits = Column(Integer, nullable=True)

    # --- 広告関連 ---
    ad_reach = Column(Integer, nullable=True)
    ad_likes = Column(Integer, nullable=True)
    ad_comments = Column(Integer, nullable=True)
    ad_saves = Column(Integer, nullable=True)

    # --- Feed関連 ---
    feed_reach = Column(Integer, nullable=True)
    feed_likes = Column(Integer, nullable=True)
    feed_comments = Column(Integer, nullable=True)
    feed_saves = Column(Integer, nullable=True)

    # --- Reel関連 ---
    reel_reach = Column(Integer, nullable=True)
    reel_likes = Column(Integer, nullable=True)
    reel_comments = Column(Integer, nullable=True)
    reel_saves = Column(Integer, nullable=True)

    # --- Story関連 ---
    story_reach = Column(Integer, nullable=True)
    story_likes = Column(Integer, nullable=True)
    story_comments = Column(Integer, nullable=True)
    story_saves = Column(Integer, nullable=True)

    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

    account = relationship("Account", back_populates="insight_snapshots")

class PostInsight(Base):
    __tablename__ = "post_insights"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    ig_media_id = Column(String, nullable=False, unique=True)
    caption = Column(String, nullable=True)
    content_type = Column(String, nullable=False)  # feed / reel / story / ad
    media_type = Column(String, nullable=False)    # IMAGE / VIDEO / CAROUSEL_ALBUM
    media_url = Column(String, nullable=True)
    permalink = Column(String, nullable=True)
    
    created_at = Column(DateTime, nullable=False)  # 投稿された日時

    impressions = Column(Integer, nullable=True)
    reach = Column(Integer, nullable=True)
    like_count = Column(Integer, nullable=True)
    comment_count = Column(Integer, nullable=True)
    save_count = Column(Integer, nullable=True)

    video_views = Column(Integer, nullable=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

    account = relationship("Account", back_populates="post_insights")
