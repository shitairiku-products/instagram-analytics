def test_monthly_details(client):
    response = client.get("/api/v1/instagram/analytics/monthly-details?mediatype=feed&month=202301")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_type_engagement(client):
    response = client.get("/api/v1/instagram/analytics/post-type-engagement?mediatype=feed&from=2023-01-01&to=2023-12-31")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_annual_summary(client):
    response = client.get("/api/v1/instagram/analytics/annual-summary?from=2023-01-01&to=2023-12-31")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_insights(client):
    response = client.get("/api/v1/instagram/analytics/post-insights?month=202301&mediatype=feed")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
