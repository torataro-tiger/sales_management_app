from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    item,
    market,
    medium,
    month,
    month_market_commission,
    month_sales_quantity,
    position,
    sales_calculation,
    seller,
)

app = FastAPI()

# CORS設定
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 許可するオリジン
    allow_credentials=True,  # Cookieを含むリクエストを許可（認証なしでもTrueで問題ない）
    allow_methods=["*"],  # 全てのHTTPメソッドを許可
    allow_headers=["*"],  # 全てのヘッダーを許可
)

app.include_router(month_market_commission.router)
app.include_router(market.router)
app.include_router(item.router)
app.include_router(sales_calculation.router)
app.include_router(medium.router)
app.include_router(month_sales_quantity.router)
app.include_router(seller.router)
app.include_router(position.router)
app.include_router(month.router)


@app.get("/health_check")
def hello():
    return {"message": "hello"}
