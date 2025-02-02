from cruds import item as item_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import item as item_schema
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates

router = APIRouter()


@router.post(
    "/item_registration",
    tags=["item"],
    response_model=item_schema.ItemRegisterResponse,
)
async def item_registration(
    item_body: item_schema.ItemCreate,
    db: AsyncSession = Depends(get_db),
):
    result_medium = await validates.get_medium(
        db=db,
        medium_id=item_body.medium_id,
    )
    if result_medium is None:
        raise HTTPException(404)

    result_market = await validates.get_market(
        db=db,
        market_id=item_body.market_id,
    )
    if result_market is None:
        raise HTTPException(404)

    result_seller = await validates.get_seller(
        db=db,
        seller_id=item_body.seller_id,
    )
    if result_seller is None:
        raise HTTPException(404)

    return await item_cruds.create_item(
        db=db,
        item_create=item_body,
    )


@router.get(
    "/item_search",
    tags=["item"],
    response_model=list[item_schema.ItemReadResponse],
)
async def item_search(
    item_name: str = "",
    db: AsyncSession = Depends(get_db),
):
    result = await item_cruds.read_item(
        db=db,
        item_name=item_name,
    )
    return format_data(result)


@router.put(
    "/item_update",
    tags=["item"],
    response_model=item_schema.ItemUpdateResponse,
)
async def item_update(
    item_body: item_schema.ItemUpdate,
    db: AsyncSession = Depends(get_db),
):
    original = await validates.get_item(
        db,
        item_body.id,
    )
    if original is None:
        raise HTTPException(404)
    result_medium = await validates.get_medium(
        db=db,
        medium_id=item_body.update_medium_id,
    )
    if result_medium is None:
        raise HTTPException(404)

    result_market = await validates.get_market(
        db=db,
        market_id=item_body.update_market_id,
    )
    if result_market is None:
        raise HTTPException(404)

    result_seller = await validates.get_seller(
        db=db,
        seller_id=item_body.update_seller_id,
    )
    if result_seller is None:
        raise HTTPException(404)

    result = await item_cruds.update_item(
        db=db,
        item_update=item_body,
        original=original,
    )
    return result


def format_data(results):
    response = []
    for result in results:
        item = result["Item"].__dict__  # type: ignore
        medium = result["Medium"].__dict__  # type: ignore
        market = result["Market"].__dict__  # type: ignore
        seller = result["Seller"].__dict__  # type: ignore
        response.append(
            item_schema.ItemReadResponse(
                id=item["id"],
                item_name=item["item_name"],
                price=item["price"],
                sales_start_month=item["sales_start_month"],
                medium_id=medium["id"],
                medium_name=medium["medium_name"],
                market_id=market["id"],
                market_name=market["market_name"],
                seller_id=seller["id"],
                seller_name=seller["seller_name"],
            )
        )
    return response
