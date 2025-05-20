from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apiy.endpoint import router as api_router
from app.database.session import engine
from app.database.model.base import Base  # ←ここを修正
# モデルをimport
import app.database.model.models


# データベーステーブルを作成
print(Base.metadata.tables)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IG Insight API")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーターの登録
app.include_router(api_router, prefix="/api")

# ルーティング一覧を起動時に出力
@app.on_event("startup")
def print_routes():
    print("=== FastAPI Registered Routes ===")
    for route in app.routes:
        print(route.path, route.methods)
