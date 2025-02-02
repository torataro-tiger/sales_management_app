from datetime import date
from typing import Final

from pydantic import BaseModel, Field


class MonthSummaryCreate(BaseModel):
    month_id: str
