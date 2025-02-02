from cruds import position as position_cruds
from cruds import seller as seller_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import seller as seller_schema
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates as seller_validates

router = APIRouter()


@router.post(
    "/seller_registration",
    tags=["seller"],
    response_model=seller_schema.SellerRegisterResponse,
)
async def seller_registration(
    seller_body: seller_schema.SellerCreate,
    db: AsyncSession = Depends(get_db),
):
    # リクエスト検証
    result_position = await seller_validates.get_position(
        db=db,
        position_id=seller_body.position_id,
    )
    if result_position is None:
        raise HTTPException(404)

    # 登録
    seller_create = seller_schema.SellerCreate(
        seller_name=seller_body.seller_name,
        position_id=seller_body.position_id,
    )
    return await seller_cruds.create_seller(
        db=db,
        seller_create=seller_create,
    )


@router.get(
    "/seller_search",
    tags=["seller"],
    response_model=list[seller_schema.SellerReadResponse],
)
async def seller_search(
    seller_name: str = "",
    db: AsyncSession = Depends(get_db),
):
    results = await seller_cruds.read_seller(
        db=db,
        seller_name=seller_name,
    )
    return format_data(results)


@router.put(
    "/seller_update",
    tags=["seller"],
    response_model=seller_schema.SellerUpdateResponse,
)
async def seller_update(
    seller_body: seller_schema.SellerUpdate,
    db: AsyncSession = Depends(get_db),
):
    original = await seller_validates.get_seller(
        db,
        seller_body.id,
    )
    if original is None:
        raise HTTPException(404)

    result = await seller_cruds.update_seller(
        db=db,
        seller_update=seller_body,
        original=original,
    )
    return result


def format_data(results):
    response = []
    for result in results:
        seller = result["Seller"].__dict__  # type: ignore
        position = result["Position"].__dict__  # type: ignore
        response.append(
            seller_schema.SellerReadResponse(
                id=seller["id"],
                seller_name=seller["seller_name"],
                position_id=seller["position_id"],
                position_name=position["position_name"],
            )
        )
    return response
