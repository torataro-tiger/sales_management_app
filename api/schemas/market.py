from pydantic import BaseModel, Field


class Market(BaseModel):
    id: str


class MarketCreate(BaseModel):
    market_name: str = Field(..., examples=["技術書典"])


class MarketUpdate(Market):
    update_market_name: str = Field(..., examples=["BOOTH"])


class MarketRegisterResponse(Market):
    market_name: str


class MarketReadResponse(Market):
    market_name: str


class MarketUpdateResponse(Market):
    market_name: str
