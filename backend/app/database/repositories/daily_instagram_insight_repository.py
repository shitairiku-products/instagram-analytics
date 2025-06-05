from sqlalchemy.orm import Session
from sqlalchemy import and_, extract, func
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
    
    def get_engagement_by_type(self, start: date, end: date, media_type: str):
        return (
            self.db.query(
                func.to_char(DailyInstagramInsight.date, 'YYYY-MM').label("period"),
                DailyInstagramInsight.media_type,
                func.sum(DailyInstagramInsight.reach).label("reach"),
                func.sum(DailyInstagramInsight.likes).label("likes"),
                func.sum(DailyInstagramInsight.comments).label("comments"),
                func.sum(DailyInstagramInsight.shares).label("shares"),
                func.sum(DailyInstagramInsight.saves).label("saves")
            )
            .filter(
                DailyInstagramInsight.date >= start,
                DailyInstagramInsight.date <= end,
                DailyInstagramInsight.media_type == media_type
            )
            .group_by("period", DailyInstagramInsight.media_type)
            .order_by("period")
            .all()
        )
    
    def get_annual_summary(self, start: date, end: date):
        return (
            self.db.query(
                func.to_char(DailyInstagramInsight.date, 'YYYY-MM').label("period"),
                func.max(DailyInstagramInsight.followers).label("followers"),
                func.sum(DailyInstagramInsight.reach).label("reach"),
                func.sum(DailyInstagramInsight.impressions).label("impressions"),
                func.sum(DailyInstagramInsight.profile_visits).label("profile_visits"),
                func.sum(DailyInstagramInsight.website_clicks).label("website_clicks"),
                func.sum(DailyInstagramInsight.likes).label("likes"),
                func.sum(DailyInstagramInsight.comments).label("comments"),
                func.sum(DailyInstagramInsight.shares).label("shares"),
                func.sum(DailyInstagramInsight.saves).label("saves")
            )
            .filter(
                DailyInstagramInsight.date >= start,
                DailyInstagramInsight.date <= end
            )
            .group_by("period")
            .order_by("period")
            .all()
        )
