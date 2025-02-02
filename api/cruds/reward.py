from models import models
from sqlalchemy.ext.asyncio import AsyncSession


async def create_reward_datum(
    db: AsyncSession,
    reward_datum: list[models.Reward],
) -> list[models.Reward]:
    db.add_all(reward_datum)
    await db.commit()
    for reward_data in reward_datum:
        await db.refresh(reward_data)
    return reward_datum
