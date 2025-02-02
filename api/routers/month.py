from datetime import date
from typing import Optional

from cruds import month as month_cruds
from db import get_db
from fastapi import APIRouter, Depends
from schemas import month as month_schema
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get(
    "/month_search",
    tags=["month"],
    response_model=list[month_schema.MonthGetResponse],
)
async def month_search(
    start_month: Optional[date] = None,
    end_month: Optional[date] = None,
    db: AsyncSession = Depends(get_db),
):
    result = await month_cruds.read_months(
        db=db,
        start_month=start_month,
        end_month=end_month,
    )
    return result
