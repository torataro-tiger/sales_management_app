from cruds import position as position_cruds
from db import get_db
from fastapi import APIRouter, Depends
from schemas import position as position_schema
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get(
    "/position_search",
    tags=["position"],
    response_model=list[position_schema.PositionGetResponse],
)
async def position_search(
    position_name: str = "",
    db: AsyncSession = Depends(get_db),
):
    result = await position_cruds.read_position(
        db=db,
        position_name=position_name,
    )
    return result
