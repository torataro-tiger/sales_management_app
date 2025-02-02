from models import models
from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


async def read_position(
    db: AsyncSession,
    position_name: str,
) -> list[models.Position]:
    if position_name == "":  # position_name が空文字列なら全件検索
        query = select(models.Position)
    else:  # position_name が入力されている場合は完全一致で検索
        query = select(models.Position).filter(models.Position.position_name == position_name)

    result: Result = await db.execute(query)
    result_list = result.scalars().all()
    return result_list
