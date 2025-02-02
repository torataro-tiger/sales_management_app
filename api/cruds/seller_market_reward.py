from models import models
from sqlalchemy.ext.asyncio import AsyncSession


async def create_seller_market_reward_datum(
    db: AsyncSession,
    seller_market_reward_datum: list[models.SellerMarketReward],
) -> list[models.SellerMarketReward]:
    db.add_all(seller_market_reward_datum)
    await db.commit()
    for seller_market_reward_data in seller_market_reward_datum:
        await db.refresh(seller_market_reward_data)
    return seller_market_reward_datum
