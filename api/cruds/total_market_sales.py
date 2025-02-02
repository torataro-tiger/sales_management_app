from models import models
from sqlalchemy.ext.asyncio import AsyncSession


async def create_total_market_sales_datum(
    db: AsyncSession,
    total_market_sales_datum: list[models.TotalMarketSales],
) -> list[models.TotalMarketSales]:
    db.add_all(total_market_sales_datum)
    await db.commit()
    for total_market_sales_data in total_market_sales_datum:
        await db.refresh(total_market_sales_data)
    return total_market_sales_datum
