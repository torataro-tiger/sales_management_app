from datetime import date

from models import models
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_month(
    db: AsyncSession,
    month: date,
) -> models.Month:
    month = models.Month(
        month=month,
    )
    db.add(month)
    await db.commit()
    await db.refresh(month)
    return month


async def read_months(
    db: AsyncSession,
    start_month: date | None,  # 2022-12-01
    end_month: date | None,  # 2024-12-01,
) -> list[models.Month]:

    query = select(models.Month)

    if start_month or end_month:
        filters = []
        if start_month:
            filters.append(models.Month.month >= start_month)
        if end_month:
            filters.append(models.Month.month <= end_month)
        query = query.filter(and_(*filters))

    result = await db.execute(query)
    return result.scalars().all()  # type: ignore


async def get_month(
    db: AsyncSession,
    month: date,
) -> models.Month:
    query = select(models.Month).filter(models.Month.month == month)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_month_with_id(
    db: AsyncSession,
    month_id: date,
) -> models.Month:
    query = select(models.Month).filter(models.Month.id == month_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def delete_month(db: AsyncSession, original: models.Month):
    await db.delete(original)
    await db.commit()
