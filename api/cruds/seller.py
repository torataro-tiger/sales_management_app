from models import models
from schemas import seller as seller_schema
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def create_seller(
    db: AsyncSession,
    seller_create: seller_schema.SellerCreate,
) -> models.Seller:

    seller = models.Seller(**seller_create.model_dump())
    db.add(seller)
    await db.commit()
    await db.refresh(seller)
    return seller


async def read_seller(
    db: AsyncSession,
    seller_name: str,
) -> list[dict[str, models.Seller | models.Position]]:

    query = select(models.Seller, models.Position).join(
        models.Position,
        models.Position.id == models.Seller.position_id,
    )

    if seller_name != "":  # seller_name が入力されている場合は完全一致で検索
        query = query.filter(models.Seller.seller_name == seller_name)

    result: Result = await db.execute(query)
    result_list = [{"Seller": result[0], "Position": result[1]} for result in result.all()]
    return result_list


async def read_seller_with_ids(
    db: AsyncSession,
    ids: list[str],
) -> list[models.Seller]:

    query = select(models.Seller).where(models.Seller.id.in_(ids))

    result: Result = await db.execute(query)
    result_list = result.scalars().all()
    return result_list


async def update_seller(
    db: AsyncSession,
    seller_update: seller_schema.SellerUpdate,
    original: models.Seller,
) -> models.Seller:

    original.seller_name = seller_update.update_seller_name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original
