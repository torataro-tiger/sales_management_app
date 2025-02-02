from models import models
from sqlalchemy import and_, select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def get_position(
    db: AsyncSession,
    position_id: str,
) -> models.Position | None:
    query = select(models.Position).filter(models.Position.id == position_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_seller(
    db: AsyncSession,
    seller_id: str,
) -> models.Seller | None:
    query = select(models.Seller).filter(models.Seller.id == seller_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_medium(
    db: AsyncSession,
    medium_id: str,
) -> models.Medium | None:
    query = select(models.Medium).filter(models.Medium.id == medium_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_market(
    db: AsyncSession,
    market_id: str,
) -> models.Market | None:
    query = select(models.Market).filter(models.Market.id == market_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_item(
    db: AsyncSession,
    item_id: str,
) -> models.Item | None:
    query = select(models.Item).filter(models.Item.id == item_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_month_sales_quantity(
    db: AsyncSession,
    month_sales_quantity_id: str,
) -> models.MonthSalesQuantity | None:
    query = select(models.MonthSalesQuantity).filter(models.MonthSalesQuantity.id == month_sales_quantity_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_month_market_commission(
    db: AsyncSession,
    month_market_commission_id: str,
) -> models.MonthMarketCommission | None:
    query = select(models.MonthMarketCommission).filter(models.MonthMarketCommission.id == month_market_commission_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_month(
    db: AsyncSession,
    month_id: str,
) -> models.Month | None:
    query = select(models.Month).filter(models.Month.id == month_id)
    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None


async def get_month_sales_quantity_with_month_and_item(
    db: AsyncSession,
    month_id: str,
    item_id: str,
) -> models.MonthSalesQuantity | None:

    query = select(models.MonthSalesQuantity).filter(
        and_(
            models.MonthSalesQuantity.month_id == month_id,
            models.MonthSalesQuantity.item_id == item_id,
        )
    )

    result: Result = await db.execute(query)
    result_first = result.first()
    return result_first[0] if result_first is not None else None
