from datetime import date

from models import models
from schemas import month_sales_quantity as month_sales_quantity_schema
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import exists


async def create_month_sales_quantity(
    db: AsyncSession,
    month_id: str,
    item_id: str,
    sales_quantity: int,
) -> models.MonthSalesQuantity:

    month_sales_quantity = models.MonthSalesQuantity(
        month_id=month_id,
        item_id=item_id,
        sales_quantity=sales_quantity,
    )
    db.add(month_sales_quantity)
    await db.commit()
    await db.refresh(month_sales_quantity)
    return month_sales_quantity


async def read_month_sales_quantity(
    month_ids: list[str] | None,
    db: AsyncSession,
) -> list[dict[str, models.MonthSalesQuantity | models.Item | models.Month]]:

    query = (
        select(models.MonthSalesQuantity, models.Item, models.Month)
        .join(
            models.Item,
            models.Item.id == models.MonthSalesQuantity.item_id,
        )
        .join(
            models.Month,
            models.Month.id == models.MonthSalesQuantity.month_id,
        )
    ).where(models.MonthSalesQuantity.month_id.in_(month_ids))

    result: Result = await db.execute(query)

    check = result.all()
    print("--------------")
    print(check)
    print(len(check))
    print("--------------")
    result_list = [
        {
            "MonthSalesQuantity": result[0],
            "Item": result[1],
            "Month": result[2],
        }
        for result in check
    ]
    return result_list


async def check_month_sales_quantity(
    month_id: str,
    db: AsyncSession,
) -> bool:
    query = select(exists().where(models.MonthSalesQuantity.month_id == month_id))
    result = await db.execute(query)
    return result.scalar()


async def read_month_sales_quantity_and_item(
    month_id: str | None,
    item_id: str | None,
    db: AsyncSession,
) -> list[dict[str, models.MonthSalesQuantity | models.Item]]:

    query = select(models.MonthSalesQuantity, models.Item).join(
        models.Item,
        models.Item.id == models.MonthSalesQuantity.item_id,
    )
    if month_id:
        query = query.where(models.MonthSalesQuantity.month_id == month_id)
    if item_id:
        query = query.where(models.MonthSalesQuantity.item_id == item_id)

    result: Result = await db.execute(query)
    result_list = [{"MonthSalesQuantity": result[0], "Item": result[1]} for result in result.all()]
    return result_list


async def update_month_sales_quantity(
    db: AsyncSession,
    month_sales_quantity_update: month_sales_quantity_schema.MonthSalesQuantityUpdate,
    original: models.MonthSalesQuantity,
) -> models.MonthSalesQuantity:

    original.sales_quantity = month_sales_quantity_update.update_sales_quantity

    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original


async def delete_month_sales_quantity(
    db: AsyncSession,
    original: models.MonthSalesQuantity,
) -> None:
    await db.delete(original)
    await db.commit()


async def get_all_month_sales_quantity(
    db: AsyncSession,
) -> list[models.MonthSalesQuantity]:
    query = select(models.MonthSalesQuantity)
    result: Result = await db.execute(query)
    return result.scalars().all()
