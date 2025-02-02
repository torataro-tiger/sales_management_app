from models import models
from schemas import market as market_schema
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def create_market(
    db: AsyncSession,
    market_create: market_schema.MarketCreate,
) -> models.Market:

    market = models.Market(
        market_name=market_create.market_name,
    )
    db.add(market)
    await db.commit()
    await db.refresh(market)
    return market


async def read_market(
    db: AsyncSession,
    market_name: str,
) -> list[models.Market]:

    if market_name == "":  # market_name が空文字列なら全件検索
        query = select(models.Market)
    else:  # market_name が入力されている場合は完全一致で検索
        query = select(models.Market).filter(models.Market.market_name == market_name)

    result: Result = await db.execute(query)
    result_list = result.scalars().all()
    return result_list


async def update_market(
    db: AsyncSession,
    market_update: market_schema.MarketUpdate,
    original: models.Market,
) -> models.Market:

    original.market_name = market_update.update_market_name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original
