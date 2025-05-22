from sqlalchemy.orm import Session
from app.database.repositories.daily_instagram_insight_repository import DailyInstagramInsightRepository
from app.schemas.daily_instagram_insight_schema import EngagementByTypeResponse
from app.schemas.daily_instagram_insight_schema import DailyInstagramInsightResponse
from datetime import date
from typing import List

def get_insights_by_date_range(db: Session, start: date, end: date) -> List[DailyInstagramInsightResponse]:
    repo = DailyInstagramInsightRepository(db)
    insights = repo.get_by_date_range(start, end)
    return [DailyInstagramInsightResponse.from_orm(item) for item in insights]

def get_engagement_by_type(db: Session, start: date, end: date, media_type: str) -> List[EngagementByTypeResponse]:
    repo = DailyInstagramInsightRepository(db)
    results = repo.get_engagement_by_type(start, end, media_type)
    return [
        EngagementByTypeResponse(
            period=row.period,
            media_type=row.media_type,
            reach=row.reach,
            likes=row.likes,
            comments=row.comments,
            shares=row.shares,
            saves=row.saves
        )
        for row in results
    ]