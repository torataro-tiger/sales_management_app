from models import models
from schemas import item as item_schema
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates


async def create_item(
    db: AsyncSession,
    item_create: item_schema.ItemCreate,
) -> models.Item:

    item = models.Item(**item_create.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def read_item(
    db: AsyncSession,
    item_name: str,
) -> list[dict[str, models.Item | models.Medium | models.Market | models.Seller]]:

    query = (
        select(models.Item, models.Medium, models.Market, models.Seller)
        .join(models.Medium, models.Item.medium_id == models.Medium.id)
        .join(models.Market, models.Item.market_id == models.Market.id)
        .join(models.Seller, models.Item.seller_id == models.Seller.id)
    )

    if item_name != "":
        query = query.filter(models.Item.item_name == item_name)

    result: Result = await db.execute(query)
    result_list = [
        {
            "Item": result[0],
            "Medium": result[1],
            "Market": result[2],
            "Seller": result[3],
        }
        for result in result.all()
    ]
    return result_list


async def update_item(
    db: AsyncSession,
    item_update: item_schema.ItemUpdate,
    original: models.Item,
) -> models.Item:

    original.item_name = item_update.update_item_name  # type: ignore
    original.price = item_update.update_price  # type: ignore
    original.sales_start_month = item_update.update_sales_start_month  # type: ignore
    original.medium_id = item_update.update_medium_id  # type: ignore
    original.market_id = item_update.update_market_id  # type: ignore
    original.seller_id = item_update.update_seller_id  # type: ignore

    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original
