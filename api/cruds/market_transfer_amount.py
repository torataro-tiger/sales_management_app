from models import models
from sqlalchemy.ext.asyncio import AsyncSession


async def create_market_transfer_amount_datum(
    db: AsyncSession,
    market_transfer_amount_datum: list[models.MarketTransferAmount],
) -> list[models.MarketTransferAmount]:
    db.add_all(market_transfer_amount_datum)
    await db.commit()
    for market_transfer_amount_data in market_transfer_amount_datum:
        await db.refresh(market_transfer_amount_data)
    return market_transfer_amount_datum
