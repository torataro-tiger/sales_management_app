from pydantic import BaseModel, Field


class Seller(BaseModel):
    seller_name: str = Field(..., examples=["販売者A"])


class SellerCreate(Seller):
    position_id: str


class SellerUpdate(BaseModel):
    id: str
    update_seller_name: str = Field(..., examples=["販売者B"])


class SellerRegisterResponse(Seller):
    id: str
    position_id: str


class SellerReadResponse(Seller):
    id: str
    position_id: str
    position_name: str


class SellerUpdateResponse(Seller):
    id: str
    position_id: str
