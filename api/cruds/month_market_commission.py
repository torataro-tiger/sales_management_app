from datetime import date

from models import models
from schemas import month_market_commission as month_market_commission_schema
from sqlalchemy import and_, select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def create_month_market_commission(
    db: AsyncSession,
    month_market_commission_create: month_market_commission_schema.MonthMarketCommissionCreate,
) -> models.MonthMarketCommission:

    month_market_commission = models.MonthMarketCommission(
        **month_market_commission_create.model_dump(),
    )
    db.add(month_market_commission)
    await db.commit()
    await db.refresh(month_market_commission)
    return month_market_commission


async def read_month_market_commission(
    month_id: str | None,
    market_id: str | None,
    db: AsyncSession,
):
    query = select(models.MonthMarketCommission)

    if month_id:
        query = query.where(models.MonthMarketCommission.month_id == month_id)
    if market_id:
        query = query.where(models.MonthMarketCommission.market_id == market_id)
    result: Result = await db.execute(query)
    return result.scalars().all()


async def read_month_market_commission_and_market(
    db: AsyncSession,
    start_month: date,
    end_month: date,
    market_name: str,
) -> list[dict[str, models.MonthMarketCommission | models.Market]]:

    if market_name == "":  # market_name が空文字列なら全件検索
        query = (
            select(models.MonthMarketCommission, models.Market)
            .join(
                models.Market,
                models.Market.id == models.MonthMarketCommission.market_id,
            )
            .where(
                and_(
                    models.MonthMarketCommission.month >= start_month,
                    models.MonthMarketCommission.month <= end_month,
                )
            )
        )
    else:  # market_name が入力されている場合は完全一致で検索
        query = (
            select(models.MonthMarketCommission, models.Market)
            .join(
                models.Market,
                models.Market.id == models.MonthMarketCommission.market_id,
            )
            .where(
                and_(
                    models.MonthMarketCommission.month >= start_month,
                    models.MonthMarketCommission.month <= end_month,
                ),
                models.Market.market_name == market_name,
            )
        )

    result: Result = await db.execute(query)
    result_list = [{"MonthMarketCommission": result[0], "Market": result[1]} for result in result.all()]
    return result_list


async def update_month_market_commission(
    db: AsyncSession,
    month_market_commission_update: month_market_commission_schema.MonthMarketCommissionUpdate,
    original: models.MonthMarketCommission,
) -> models.MonthMarketCommission:

    original.commission = month_market_commission_update.update_commission
    original.market_id = month_market_commission_update.market_id

    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original


async def delete_month_sales_quantity(
    db: AsyncSession,
    original: models.MonthMarketCommission,
) -> None:
    await db.delete(original)
    await db.commit()
