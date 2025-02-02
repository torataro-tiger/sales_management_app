from datetime import date

from cruds import month_market_commission as month_market_commission_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import month_market_commission as month_market_commission_schema
from settings import DELETE_MESSAGE
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates

router = APIRouter()


@router.post(
    "/month_market_commission_registration",
    tags=["month_market_commission"],
    response_model=month_market_commission_schema.MonthMarketCommissionRegisterResponse,
)
async def month_market_commission_registration(
    month_market_commission_body: month_market_commission_schema.MonthMarketCommissionCreate,
    db: AsyncSession = Depends(get_db),
):

    result_market = await validates.get_market(
        db=db,
        market_id=month_market_commission_body.market_id,
    )
    if result_market is None:
        raise HTTPException(404)

    # 既に登録されているmonthとmarket_idが被ったらはじく処理が必要

    return await month_market_commission_cruds.create_month_market_commission(
        db=db,
        month_market_commission_create=month_market_commission_body,
    )


@router.get(
    "/month_market_commission_search",
    tags=["month_market_commission"],
    response_model=list[month_market_commission_schema.MonthMarketCommissionReadResponse],
)
async def month_market_commission_search(
    start_month: date,  # 2022-12-01T00:00:00
    end_month: date,  # 2024-12-01T00:00:00,
    market_name: str = "",
    db: AsyncSession = Depends(get_db),
):

    results = await month_market_commission_cruds.read_month_market_commission_and_market(
        db=db,
        market_name=market_name,
        start_month=start_month,
        end_month=end_month,
    )

    return format_data(results)


@router.put(
    "/month_market_commission_update",
    tags=["month_market_commission"],
    response_model=month_market_commission_schema.MonthMarketCommissionUpdateResponse,
)
async def month_market_commission_update(
    month_market_commission_body: month_market_commission_schema.MonthMarketCommissionUpdate,
    db: AsyncSession = Depends(get_db),
):
    result_market = await validates.get_market(
        db=db,
        market_id=month_market_commission_body.market_id,
    )
    if result_market is None:
        raise HTTPException(404)

    original = await validates.get_month_market_commission(
        db=db,
        month_market_commission_id=month_market_commission_body.id,
    )
    if original is None:
        raise HTTPException(404)

    result = await month_market_commission_cruds.update_month_market_commission(
        db=db,
        month_market_commission_update=month_market_commission_body,
        original=original,
    )
    return result


@router.delete(
    "/month_market_commission_delete",
    tags=["month_market_commission"],
    response_model=None,
)
async def month_market_commission_delete(
    month_market_commission_body: month_market_commission_schema.MonthMarketCommissionDelete,
    db: AsyncSession = Depends(get_db),
):
    original = await validates.get_month_market_commission(
        db=db,
        month_market_commission_id=month_market_commission_body.id,
    )
    if original is None:
        raise HTTPException(404)

    await month_market_commission_cruds.delete_month_sales_quantity(
        db=db,
        original=original,
    )

    return DELETE_MESSAGE


def format_data(results):
    response = []
    for result in results:
        month_market_commission = result["MonthMarketCommission"].__dict__  # type: ignore
        market = result["Market"].__dict__  # type: ignore
        response.append(
            month_market_commission_schema.MonthMarketCommissionReadResponse(  # type: ignore
                month=month_market_commission["month"],  # type: ignore
                id=month_market_commission["id"],
                market_id=month_market_commission["market_id"],
                commission=month_market_commission["commission"],
                market_name=market["market_name"],
            )
        )
    return response
