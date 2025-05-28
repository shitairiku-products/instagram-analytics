from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models.daily_post_insight_model import DailyPostInsight
from datetime import date

class DailyPostInsightRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_post_insights_by_month(self, year: int, month: int, media_type: str):
        return (
            self.db.query(
                func.to_char(DailyPostInsight.date, 'YYYY-MM').label("period"),
                DailyPostInsight.media_type,
                func.sum(DailyPostInsight.reach).label("reach"),
                func.sum(DailyPostInsight.likes).label("likes"),
                func.sum(DailyPostInsight.comments).label("comments"),
                func.sum(DailyPostInsight.shares).label("shares"),
                func.sum(DailyPostInsight.saves).label("saves")
            )
            .filter(
                func.extract('year', DailyPostInsight.date) == year,
                func.extract('month', DailyPostInsight.date) == month,
                DailyPostInsight.media_type == media_type
            )
            .group_by("period", DailyPostInsight.media_type)
            .order_by("period")
            .all()
        )