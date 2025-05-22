from pydantic import BaseModel
from datetime import date
from typing import Optional

# Full schema used for internal or administrative endpoints
# Includes all fields available in the daily_instagram_insight table
class DailyInstagramInsightResponse(BaseModel):
    date: date
    media_type: str
    new_followers: int
    followers: int
    impressions: int
    reach: int
    profile_visits: int
    website_clicks: int
    likes: int
    comments: int
    shares: int
    saves: int

    class Config:
        from_attributes = True  

# Minimal schema for monthly details view
# Used specifically by the frontend for the /monthly-details endpoint
# Returns only the fields needed for UI display
class MonthlyInsightResponse(BaseModel):
    date: date
    new_followers: int
    impressions: int
    reach: int
    profile_visits: int
    website_clicks: int

    class Config:
        from_attributes = True

class EngagementByTypeResponse(BaseModel):
    period: str
    media_type: str
    reach: int
    likes: int
    comments: int
    shares: int
    saves: int

    class Config:
        from_attributes = True