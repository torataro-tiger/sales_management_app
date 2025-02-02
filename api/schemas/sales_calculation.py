from pydantic import BaseModel


class SalesCalculation(BaseModel):
    month_id: str
