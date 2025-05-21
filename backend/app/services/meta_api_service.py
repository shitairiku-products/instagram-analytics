import os
import requests

def fetch_instagram_account_info():
    access_token = os.getenv("META_ACCESS_TOKEN")
    if not access_token:
        raise ValueError("META_ACCESS_TOKEN is not set in environment variables.")

    # Instagram Graph APIのエンドポイント
    url = "https://graph.instagram.com/me"
    fields = [
        "id",
        "username",
        "account_type",
        "media_count",
        "profile_picture_url"
    ]
    params = {
        "fields": ",".join(fields),
        "access_token": access_token
    }

    response = requests.get(url, params=params)
    try:
        response.raise_for_status()
    except requests.HTTPError as e:
        raise Exception(f"Meta API error: {response.status_code} {response.text}")
    return response.json()
