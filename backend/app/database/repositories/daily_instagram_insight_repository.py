from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database.models.daily_instagram_insight_model import DailyInstagramInsight
from datetime import date
from typing import List

class DailyInstagramInsightRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_date_range(self, start: date, end: date) -> List[DailyInstagramInsight]:
        return self.db.query(DailyInstagramInsight).filter(
            and_(
                DailyInstagramInsight.date >= start,
                DailyInstagramInsight.date <= end
            )
        ).all()