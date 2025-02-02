from datetime import date

from cruds import month as month_cruds
from cruds import month_sales_quantity as month_sales_quantity_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import month_sales_quantity as month_sales_quantity_schema
from settings import DELETE_MESSAGE
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates

router = APIRouter()


@router.post(
    "/month_sales_quantity_registration",
    tags=["month_sales_quantity"],
    response_model=month_sales_quantity_schema.MonthSalesQuantityRegisterResponse,
)
async def month_sales_quantity_registration(
    month_sales_quantity_body: month_sales_quantity_schema.MonthSalesQuantityCreate,
    db: AsyncSession = Depends(get_db),
):
    # 検証
    result_item = await validates.get_item(
        db=db,
        item_id=month_sales_quantity_body.item_id,
    )
    if result_item is None:
        raise HTTPException(404)
    item_id = result_item.id

    result_month = await month_cruds.get_month(
        db=db,
        month=month_sales_quantity_body.month,
    )
    if result_month is None:
        # 登録されていない月があれば新たに追加する処理
        create_result_month = await month_cruds.create_month(
            db=db,
            month=month_sales_quantity_body.month,
        )
        month_id = create_result_month.id
    else:
        # # 既に登録されているmonthとitem_idが被ったらはじく処理
        month_id = result_month.id
        result_month_sales_quantity = validates.get_month_sales_quantity_with_month_and_item(
            db=db,
            item_id=item_id,  # type: ignore
            month_id=month_id,  # type: ignore
        )
        if result_month_sales_quantity:
            raise HTTPException(400, "重複しているデータがあります。")

    return await month_sales_quantity_cruds.create_month_sales_quantity(
        db=db,
        month_id=month_id,  # type: ignore
        item_id=item_id,  # type: ignore
        sales_quantity=month_sales_quantity_body.sales_quantity,
    )


@router.get(
    "/month_sales_quantity_search",
    tags=["month_sales_quantity"],
    response_model=list[month_sales_quantity_schema.MonthSalesQuantityReadResponse],
)
async def month_sales_quantity_search(
    start_month: date,
    end_month: date,
    db: AsyncSession = Depends(get_db),
):
    results_month = await month_cruds.read_months(
        db=db,
        start_month=start_month,
        end_month=end_month,
    )

    month_ids = [result_month.id for result_month in results_month]

    results = await month_sales_quantity_cruds.read_month_sales_quantity(
        month_ids=month_ids,  # type: ignore
        db=db,
    )

    return format_data(results)


@router.put(
    "/month_sales_quantity_update",
    tags=["month_sales_quantity"],
    response_model=month_sales_quantity_schema.MonthSalesQuantityUpdateResponse,
)
async def month_sales_quantity_update(
    month_sales_quantity_body: month_sales_quantity_schema.MonthSalesQuantityUpdate,
    db: AsyncSession = Depends(get_db),
):
    original = await validates.get_month_sales_quantity(
        db=db,
        month_sales_quantity_id=month_sales_quantity_body.id,
    )
    if original is None:
        raise HTTPException(404)

    result = await month_sales_quantity_cruds.update_month_sales_quantity(
        db=db,
        month_sales_quantity_update=month_sales_quantity_body,
        original=original,
    )
    return result


@router.delete(
    "/month_sales_quantity_delete",
    tags=["month_sales_quantity"],
    response_model=None,
)
async def month_sales_quantity_delete(
    month_sales_quantity_body: month_sales_quantity_schema.MonthSalesQuantityDelete,
    db: AsyncSession = Depends(get_db),
):
    original = await validates.get_month_sales_quantity(
        db=db,  # type: ignore
        month_sales_quantity_id=month_sales_quantity_body.id,  # type: ignore
    )
    if original is None:
        raise HTTPException(404)

    await month_sales_quantity_cruds.delete_month_sales_quantity(
        db=db,
        original=original,
    )

    # month_sales_quantityにとある月のレコードがなければmonthテーブルの該当レコードを削除
    month_id = original.month_id
    exists = await month_sales_quantity_cruds.check_month_sales_quantity(
        db=db,
        month_id=month_id,  # type: ignore
    )
    if not exists:
        original_month = await month_cruds.get_month_with_id(
            db=db,
            month_id=month_id,  # type: ignore
        )
        await month_cruds.delete_month(db=db, original=original_month)

    return DELETE_MESSAGE


def format_data(results):
    response = []
    for result in results:
        month_sales_quantity = result["MonthSalesQuantity"].__dict__  # type: ignore
        item = result["Item"].__dict__  # type: ignore
        month = result["Month"].__dict__  # type: ignore
        response.append(
            month_sales_quantity_schema.MonthSalesQuantityReadResponse(  # type: ignore
                month_id=month["id"],
                id=month_sales_quantity["id"],
                item_id=item["id"],
                sales_quantity=month_sales_quantity["sales_quantity"],
                item_name=item["item_name"],
                month=month["month"],
            )
        )
    return response
