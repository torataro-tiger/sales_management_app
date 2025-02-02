from datetime import date

from models import models
from schemas import month_summary as month_summary_schema
from sqlalchemy import and_, select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def create_month_summary(
    db: AsyncSession,
    month_summary_create: month_summary_schema.MonthSummaryCreate,
) -> models.MonthSummary:

    month_summary = models.MonthSummary(**month_summary_create.model_dump())
    db.add(month_summary)
    await db.commit()
    await db.refresh(month_summary)
    return month_summary
