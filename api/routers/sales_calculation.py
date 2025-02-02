import uuid
from math import ceil

from cruds import item_month_sales as item_month_sales_cruds
from cruds import market_transfer_amount as market_transfer_amount_cruds
from cruds import month_market_commission as month_market_commission_cruds
from cruds import month_sales_quantity as month_sales_quantity_cruds
from cruds import month_summary as month_summary_cruds
from cruds import reward as reward_cruds
from cruds import seller as seller_cruds
from cruds import seller_market_reward as seller_market_reward_cruds
from cruds import seller_market_sales as seller_market_sales_cruds
from cruds import total_market_sales as total_market_sales_cruds
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import models
from schemas import month_summary as month_summary_schema
from schemas import sales_calculation as sales_calculation_schema
from settings import COMMISSION_RATIO, MEMBER_ID, REP_ID
from sqlalchemy.ext.asyncio import AsyncSession
from validates import validates

router = APIRouter()


@router.post("/sales_month_calculation", tags=["sales_calculation"])
async def sales_month_calculation(
    sales_calculation_body: sales_calculation_schema.SalesCalculation,
    db: AsyncSession = Depends(get_db),
):
    month_id = sales_calculation_body.month_id
    result_market = await validates.get_month(
        db=db,
        month_id=month_id,
    )
    if result_market is None:
        raise HTTPException(404)

    (
        item_month_sales_datum,
        seller_market_sales_datum,
        total_market_sales_datum,
        market_transfer_amount_datum,
        seller_market_reward_datum,
        reward_datum,
    ) = await calculate_sales_and_rewards(
        db=db,
        month_id=month_id,
    )

    await register_sales_and_rewards(
        item_month_sales_datum,
        seller_market_sales_datum,
        total_market_sales_datum,
        market_transfer_amount_datum,
        seller_market_reward_datum,
        reward_datum,
        db=db,
    )


# @router.put("/sales_calculation_update", tags=["sales_calculation"])
# def sales_calculation_update():
#     pass


async def calculate_sales_and_rewards(
    db: AsyncSession,
    month_id: str,
) -> tuple[
    list[models.ItemMonthSales],
    list[models.SellerMarketSales],
    list[models.TotalMarketSales],
    list[models.MarketTransferAmount],
    list[models.SellerMarketReward],
    list[models.Reward],
]:
    # 月次サマリ登録
    result_month_summary = await month_summary_cruds.create_month_summary(
        db=db,
        month_summary_create=month_summary_schema.MonthSummaryCreate(
            month_id=month_id,
        ),
    )

    month_summary_id = result_month_summary.id

    # 売上計算開始
    result_month_sales_quantity = await month_sales_quantity_cruds.read_month_sales_quantity_and_item(
        month_id=month_id,
        item_id=None,
        db=db,
    )

    item_month_sales_datum: list[models.ItemMonthSales] = []
    seller_market_sales_datum: list[models.SellerMarketSales] = []
    total_market_sales_datum: list[models.TotalMarketSales] = []

    seller_market_list = set()
    seller_list = set()
    market_list = set()
    for month_sales_quantity_data in result_month_sales_quantity:
        sales_quantity = month_sales_quantity_data["MonthSalesQuantity"].sales_quantity  # type: ignore
        price = month_sales_quantity_data["Item"].price  # type: ignore
        seller_id = month_sales_quantity_data["Item"].seller_id  # type: ignore
        market_id = month_sales_quantity_data["Item"].market_id  # type: ignore
        month_sales_quantity_id = month_sales_quantity_data["MonthSalesQuantity"].id  # type: ignore
        total_seles = sales_quantity * price

        # 月次商品売上計算
        item_month_sales_data = models.ItemMonthSales(
            month_summary_id=month_summary_id,
            month_sales_quantity_id=month_sales_quantity_id,
            total_sales=total_seles,
        )
        item_month_sales_datum.append(item_month_sales_data)

        # 月次販売者マーケット売上計算
        if (seller_id, market_id) not in seller_market_list:
            seller_market_list.add((seller_id, market_id))
            seller_market_sales_datum.append(
                models.SellerMarketSales(
                    id=str(uuid.uuid4()),
                    month_summary_id=month_summary_id,
                    seller_id=seller_id,
                    market_id=market_id,
                    seller_total_sales=total_seles,
                )
            )
        else:
            for seller_market_sales_data in seller_market_sales_datum:
                if (seller_market_sales_data.seller_id, seller_market_sales_data.market_id) == (seller_id, market_id):
                    seller_market_sales_data.seller_total_sales += total_seles

        # 月次マーケット売上計算
        if market_id not in market_list:
            market_list.add(market_id)
            total_market_sales_datum.append(
                models.TotalMarketSales(
                    id=str(uuid.uuid4()),
                    month_summary_id=month_summary_id,
                    market_id=market_id,
                    total_market_sales=total_seles,
                )
            )
        else:
            for total_market_sales_data in total_market_sales_datum:
                if total_market_sales_data.market_id == market_id:  # type: ignore
                    total_market_sales_data.total_market_sales += total_seles

        if seller_id not in seller_list:
            seller_list.add(seller_id)

    # 報酬計算開始
    result_month_market_commission = await month_market_commission_cruds.read_month_market_commission(
        month_id=month_id,
        market_id=None,
        db=db,
    )

    # 月次マーケット振込金額計算
    market_transfer_amount_with_extra: list = []
    for month_market_commission_data in result_month_market_commission:
        for total_market_sales_data in total_market_sales_datum:
            if total_market_sales_data.market_id == month_market_commission_data.market_id:
                month_market_commission_id = month_market_commission_data.id
                transfer_amount = total_market_sales_data.total_market_sales - month_market_commission_data.commission

                market_transfer_amount_with_extra.append(
                    {
                        "MarketTransferAmount": models.MarketTransferAmount(
                            id=str(uuid.uuid4()),
                            month_summary_id=month_summary_id,
                            total_market_sales_id=total_market_sales_data.id,
                            month_market_commission_id=month_market_commission_id,
                            transfer_amount=transfer_amount,
                        ),
                        "market_id": month_market_commission_data.market_id,
                        "total_market_sales": total_market_sales_data.total_market_sales,
                    }
                )
                break

    market_transfer_amount_datum = [data["MarketTransferAmount"] for data in market_transfer_amount_with_extra]

    # 月次販売者マーケット報酬計算
    # 販売者と役職の紐づけ
    result_seller = await seller_cruds.read_seller_with_ids(ids=seller_list, db=db)  # type: ignore
    seller_details = {data.id: data.position_id for data in result_seller}

    seller_market_reward_with_extra: list = []
    for market_transfer_amount_with_extra_data in market_transfer_amount_with_extra:
        market_id = market_transfer_amount_with_extra_data["market_id"]
        total_market_sales = market_transfer_amount_with_extra_data["total_market_sales"]
        transfer_amount = market_transfer_amount_with_extra_data["MarketTransferAmount"].transfer_amount

        seller_market_sales_filtered_market = [
            data for data in seller_market_sales_datum if data.market_id == market_id
        ]
        seller_market_sales_only_member = [
            data
            for data in seller_market_sales_filtered_market
            if seller_details[data.seller_id] == MEMBER_ID  # type: ignore
        ]
        seller_market_sales_only_rep = [
            data
            for data in seller_market_sales_filtered_market
            if seller_details[data.seller_id] == REP_ID  # type: ignore
        ]

        all_member_amount = 0

        # メンバー計算
        for member_data in seller_market_sales_only_member:
            reward_ratio = member_data.seller_total_sales / total_market_sales if total_market_sales != 0 else 0
            reward_amount = ceil(transfer_amount * reward_ratio * COMMISSION_RATIO)
            all_member_amount += reward_amount
            seller_market_reward_with_extra.append(
                {
                    "SellerMarketReward": models.SellerMarketReward(
                        id=str(uuid.uuid4()),
                        month_summary_id=month_summary_id,
                        seller_market_sales_id=member_data.id,
                        reward_amount=reward_amount,
                        reward_ratio=reward_ratio,
                    ),
                    "seller_id": member_data.seller_id,
                }
            )

        # 代表者計算
        for rep_data in seller_market_sales_only_rep:
            reward_ratio = rep_data.seller_total_sales / total_market_sales if total_market_sales != 0 else 0
            reward_amount = transfer_amount - all_member_amount
            seller_market_reward_with_extra.append(
                {
                    "SellerMarketReward": models.SellerMarketReward(
                        id=str(uuid.uuid4()),
                        month_summary_id=month_summary_id,
                        seller_market_sales_id=member_data.id,
                        reward_amount=reward_amount,
                        reward_ratio=reward_ratio,
                    ),
                    "seller_id": rep_data.seller_id,
                }
            )
    seller_market_reward_datum = [data["SellerMarketReward"] for data in seller_market_reward_with_extra]

    # 総報酬計算
    seller_list = set()
    reward_datum: list[models.Reward] = []
    for data in seller_market_reward_with_extra:
        seller_id = data["seller_id"]
        reward_amount = data["SellerMarketReward"].reward_amount
        if seller_id not in seller_list:
            seller_list.add(seller_id)
            reward_datum.append(
                models.Reward(
                    month_summary_id=month_summary_id,
                    seller_id=seller_id,
                    reward_amount=reward_amount,
                ),
            )
        else:
            for reward_data in reward_datum:
                if seller_id == reward_data.seller_id:
                    reward_data.reward_amount += reward_amount

    return (
        item_month_sales_datum,
        seller_market_sales_datum,
        total_market_sales_datum,
        market_transfer_amount_datum,
        seller_market_reward_datum,
        reward_datum,
    )


async def register_sales_and_rewards(
    item_month_sales_datum: list[models.ItemMonthSales],
    seller_market_sales_datum: list[models.SellerMarketSales],
    total_market_sales_datum: list[models.TotalMarketSales],
    market_transfer_amount_datum: list[models.MarketTransferAmount],
    seller_market_reward_datum: list[models.SellerMarketReward],
    reward_datum: list[models.Reward],
    db: AsyncSession,
) -> None:
    await item_month_sales_cruds.create_item_month_sales_datum(
        db=db,
        item_month_sales_datum=item_month_sales_datum,  # type: ignore
    )
    await seller_market_sales_cruds.create_seller_market_sales_datum(
        db=db,
        seller_market_sales_datum=seller_market_sales_datum,  # type: ignore
    )
    await total_market_sales_cruds.create_total_market_sales_datum(
        db=db,
        total_market_sales_datum=total_market_sales_datum,  # type: ignore
    )
    await market_transfer_amount_cruds.create_market_transfer_amount_datum(
        db=db,
        market_transfer_amount_datum=market_transfer_amount_datum,  # type: ignore
    )
    await seller_market_reward_cruds.create_seller_market_reward_datum(
        db=db,
        seller_market_reward_datum=seller_market_reward_datum,  # type: ignore
    )
    await reward_cruds.create_reward_datum(
        db=db,
        reward_datum=reward_datum,  # type: ignore
    )
