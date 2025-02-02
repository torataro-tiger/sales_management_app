from datetime import date
from typing import Final

from pydantic import BaseModel, Field


class MonthMarketCommission(BaseModel):
    month_id: str


class MonthMarketCommissionCreate(MonthMarketCommission):
    market_id: str
    commission: int


class MonthMarketCommissionDelete(BaseModel):
    id: str


class MonthMarketCommissionUpdate(MonthMarketCommission):
    id: str
    market_id: str
    update_commission: int


class MonthMarketCommissionRegisterResponse(MonthMarketCommission):
    id: str
    market_id: str
    commission: int


class MonthMarketCommissionReadResponse(MonthMarketCommission):
    id: str
    market_id: str
    commission: int
    market_name: str


class MonthMarketCommissionUpdateResponse(MonthMarketCommission):
    id: str
    market_id: str
    commission: int
