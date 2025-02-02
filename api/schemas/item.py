from datetime import date

from pydantic import BaseModel, Field


class Item(BaseModel):
    item_name: str = Field(..., examples=["同人誌A"])


class ItemAllAttributes(Item):
    price: int = Field(..., examples=["750"])
    sales_start_month: date = Field(..., examples=["2023-12-02T00:00:00"])


class ItemCreate(ItemAllAttributes):
    medium_id: str
    market_id: str
    seller_id: str


class ItemUpdate(BaseModel):
    id: str
    update_item_name: str = Field(..., examples=["同人誌B"])
    update_price: int = Field(..., examples=["800"])
    update_medium_id: str
    update_market_id: str
    update_seller_id: str
    update_sales_start_month: date = Field(..., examples=["2023-12-02T00:00:00"])


class ItemRegisterResponse(ItemAllAttributes):
    id: str
    medium_id: str
    market_id: str
    seller_id: str


class ItemReadResponse(ItemAllAttributes):
    id: str
    medium_id: str
    medium_name: str
    market_id: str
    market_name: str
    seller_id: str
    seller_name: str


class ItemUpdateResponse(ItemAllAttributes):
    id: str
    medium_id: str
    market_id: str
    seller_id: str
