from pydantic import BaseModel


class Position(BaseModel):
    position_name: str


class PositionGetResponse(Position):
    id: str
