from datetime import date

from pydantic import BaseModel


class Month(BaseModel):
    pass


class MonthGetResponse(Month):
    id: str
    month: date
