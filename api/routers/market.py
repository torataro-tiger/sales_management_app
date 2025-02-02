from cruds import market as market_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import market as market_schema
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates

router = APIRouter()


@router.post(
    "/market_registration",
    tags=["market"],
    response_model=market_schema.MarketRegisterResponse,
)
async def market_registration(
    market_body: market_schema.MarketCreate,
    db: AsyncSession = Depends(get_db),
):
    return await market_cruds.create_market(
        db=db,
        market_create=market_body,
    )


@router.get(
    "/market_search",
    tags=["market"],
    response_model=list[market_schema.MarketReadResponse],
)
async def market_search(
    market_name: str = "",
    db: AsyncSession = Depends(get_db),
):
    result = await market_cruds.read_market(
        db=db,
        market_name=market_name,
    )
    return result


@router.put(
    "/market_update",
    tags=["market"],
    response_model=market_schema.MarketUpdateResponse,
)
async def market_update(
    market_body: market_schema.MarketUpdate,
    db: AsyncSession = Depends(get_db),
):
    original = await validates.get_market(
        db=db,
        market_id=market_body.id,
    )
    if original is None:
        raise HTTPException(404)
    result = await market_cruds.update_market(
        db=db,
        market_update=market_body,
        original=original,
    )
    return result
