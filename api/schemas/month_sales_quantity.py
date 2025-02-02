from datetime import date
from typing import Final

from pydantic import BaseModel, Field


class MonthSalesQuantity(BaseModel):
    month_id: str


class MonthSalesQuantityCreate(BaseModel):
    month: date
    item_id: str
    sales_quantity: int


class MonthSalesQuantityDelete(BaseModel):
    id: str


class MonthSalesQuantityUpdate(BaseModel):
    id: str
    update_sales_quantity: int


class MonthSalesQuantityRegisterResponse(MonthSalesQuantity):
    id: str
    item_id: str
    sales_quantity: int


class MonthSalesQuantityReadResponse(MonthSalesQuantity):
    id: str
    item_id: str
    sales_quantity: int
    item_name: str
    month: date


class MonthSalesQuantityUpdateResponse(MonthSalesQuantity):
    id: str
    item_id: str
    sales_quantity: int
