from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta    

from app.services.instagram_account_service import list_instagram_accounts
from app.schemas.instagram_account_schema import InstagramAccountResponse
from app.services.daily_instagram_insight_service import get_insights_by_date_range
from app.schemas.daily_instagram_insight_schema import EngagementByTypeResponse
from app.services.daily_instagram_insight_service import get_engagement_by_type
from app.schemas.daily_instagram_insight_schema import MonthlyInsightResponse
from app.schemas.daily_instagram_insight_schema import AnnualSummaryResponse
from app.services.daily_instagram_insight_service import get_annual_summary
from app.schemas.daily_instagram_insight_schema import PostInsightResponse
from app.services.daily_post_insight_service import get_post_insights_by_month

from app.database.session import get_db

router = APIRouter()

@router.get("/ping")
def ping():
    return {"message": "pong"}

@router.get("/instagram/accounts", response_model=List[InstagramAccountResponse])
def get_instagram_accounts(db: Session = Depends(get_db)):
    return list_instagram_accounts(db)

@router.get("/instagram/analytics/monthly-details", response_model=List[MonthlyInsightResponse])
def get_monthly_details(
    db: Session = Depends(get_db),
    mediatype: str = Query(...),
    from_date: Optional[date] = Query(None, alias="from"),
    to_date: Optional[date] = Query(None, alias="to"),
    month: Optional[str] = Query(None)
):
    if month:
        # Parse year and month like 202504 → 2025-04-01 to 2025-04-30
        year = int(month[:4])
        month_num = int(month[4:])
        start_date = date(year, month_num, 1)
        if month_num == 12:
            end_date = date(year + 1, 1, 1)  # next year
        else:
            end_date = date(year, month_num + 1, 1)
        end_date = end_date.replace(day=1) - timedelta(days=1)
    elif from_date and to_date:
        start_date = from_date
        end_date = to_date
    else:
        raise HTTPException(status_code=400, detail="Provide either 'month' or 'from' and 'to'")

    insights = get_insights_by_date_range(db, start_date, end_date)
    # Filtrar por tipo de mídia
    return [i for i in insights if i.media_type == mediatype]

@router.get("/instagram/analytics/post-type-engagement", response_model=List[EngagementByTypeResponse])
def post_type_engagement(
    db: Session = Depends(get_db),
    mediatype: str = Query(...),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to")
):
    return get_engagement_by_type(db, from_date, to_date, mediatype)

@router.get("/instagram/analytics/annual-summary", response_model=List[AnnualSummaryResponse])
def annual_summary(
    db: Session = Depends(get_db),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to")
):
    return get_annual_summary(db, from_date, to_date)

@router.get("/instagram/analytics/post-insights", response_model=List[PostInsightResponse])
def post_insights(
    db: Session = Depends(get_db),
    month: str = Query(...),
    mediatype: str = Query(...)
):
    year = int(month[:4])
    month_num = int(month[4:])
    return get_post_insights_by_month(db, year, month_num, mediatype)