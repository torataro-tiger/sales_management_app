from models import models
from sqlalchemy.ext.asyncio import AsyncSession


async def create_seller_market_sales_datum(
    db: AsyncSession,
    seller_market_sales_datum: list[models.SellerMarketSales],
) -> list[models.SellerMarketSales]:
    db.add_all(seller_market_sales_datum)
    await db.commit()
    for seller_market_sales_data in seller_market_sales_datum:
        await db.refresh(seller_market_sales_data)
    return seller_market_sales_datum
