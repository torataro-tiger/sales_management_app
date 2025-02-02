from models import models
from schemas import medium as medium_schema
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def create_medium(
    db: AsyncSession,
    medium_create: medium_schema.MediumCreate,
) -> models.Medium:

    medium = models.Medium(
        medium_name=medium_create.medium_name,
    )
    db.add(medium)
    await db.commit()
    await db.refresh(medium)
    return medium


async def read_medium(
    db: AsyncSession,
    medium_name: str,
) -> list[models.Medium]:

    if medium_name == "":  # medium_name が空文字列なら全件検索
        query = select(models.Medium)
    else:  # medium_name が入力されている場合は完全一致で検索
        query = select(models.Medium).filter(models.Medium.medium_name == medium_name)

    result: Result = await db.execute(query)
    result_list = result.scalars().all()
    return result_list


async def update_medium(
    db: AsyncSession,
    medium_update: medium_schema.MediumUpdate,
    original: models.Medium,
) -> models.Medium:

    original.medium_name = medium_update.update_medium_name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original
