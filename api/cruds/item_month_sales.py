from models import models
from sqlalchemy.ext.asyncio import AsyncSession


async def create_item_month_sales_datum(
    db: AsyncSession,
    item_month_sales_datum: list[models.ItemMonthSales],
) -> list[models.ItemMonthSales]:
    db.add_all(item_month_sales_datum)
    await db.commit()
    for item_month_sales_data in item_month_sales_datum:
        await db.refresh(item_month_sales_data)
    return item_month_sales_datum
