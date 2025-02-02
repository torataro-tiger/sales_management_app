from pydantic import BaseModel, Field


class Medium(BaseModel):
    id: str


class MediumCreate(BaseModel):
    medium_name: str = Field(..., examples=["紙・電子"])


class MediumUpdate(Medium):
    update_medium_name: str = Field(..., examples=["電子"])


class MediumRegisterResponse(Medium):
    medium_name: str


class MediumReadResponse(Medium):
    medium_name: str


class MediumUpdateResponse(Medium):
    medium_name: str
