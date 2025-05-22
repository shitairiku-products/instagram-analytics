from sqlalchemy.orm import Session
from app.database.repositories.daily_instagram_insight_repository import DailyInstagramInsightRepository
from app.schemas.daily_instagram_insight_schema import DailyInstagramInsightResponse
from datetime import date
from typing import List

def get_insights_by_date_range(db: Session, start: date, end: date) -> List[DailyInstagramInsightResponse]:
    repo = DailyInstagramInsightRepository(db)
    insights = repo.get_by_date_range(start, end)
    return [DailyInstagramInsightResponse.from_orm(item) for item in insights]
