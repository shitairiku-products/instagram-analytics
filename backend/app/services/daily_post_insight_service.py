from sqlalchemy.orm import Session
from app.database.repositories.daily_post_insight_repository import DailyPostInsightRepository
from app.schemas.daily_instagram_insight_schema import PostInsightResponse
from typing import List

def get_post_insights_by_month(db: Session, year: int, month: int, media_type: str) -> List[PostInsightResponse]:
    repo = DailyPostInsightRepository(db)
    rows = repo.get_post_insights_by_month(year, month, media_type)
    return [PostInsightResponse.from_orm(row) for row in rows]
