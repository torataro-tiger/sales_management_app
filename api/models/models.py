import uuid

from db import Base
from settings import STRING_NUMBER, UUID_NUMBER
from sqlalchemy import (
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship


class Market(Base):
    __tablename__ = "market"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    market_name = Column(String(STRING_NUMBER), nullable=False)

    item = relationship("Item", backref="market")
    month_market_commission = relationship("MonthMarketCommission", backref="market")
    total_market_sales = relationship("TotalMarketSales", backref="market")
    seller_market_sales = relationship("SellerMarketSales", backref="market")


class Position(Base):
    __tablename__ = "position"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    position_name = Column(String(STRING_NUMBER), nullable=False)

    seller = relationship("Seller", backref="position")


class Medium(Base):
    __tablename__ = "medium"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    medium_name = Column(String(STRING_NUMBER), nullable=False)

    item = relationship("Item", backref="medium")


class Seller(Base):
    __tablename__ = "seller"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    seller_name = Column(String(STRING_NUMBER), nullable=False)
    position_id = Column(String(UUID_NUMBER), ForeignKey("position.id"), nullable=False)

    seller_market_sales = relationship("SellerMarketSales", backref="seller")
    reward = relationship("Reward", backref="seller")


class Item(Base):
    __tablename__ = "item"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    item_name = Column(String(STRING_NUMBER), nullable=False)
    medium_id = Column(String(UUID_NUMBER), ForeignKey("medium.id"), nullable=False)
    price = Column(Integer, nullable=False)
    market_id = Column(String(UUID_NUMBER), ForeignKey("market.id"), nullable=False)
    seller_id = Column(String(UUID_NUMBER), ForeignKey("seller.id"), nullable=False)
    sales_start_month = Column(Date, nullable=False)

    month_sales_quantity = relationship("MonthSalesQuantity", backref="item")


class Month(Base):
    __tablename__ = "month"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month = Column(Date, nullable=False)

    month_sales_quantity = relationship("MonthSalesQuantity", backref="month", cascade="all, delete-orphan")
    month_market_commission = relationship("MonthMarketCommission", backref="month", cascade="all, delete-orphan")
    month_summary = relationship("MonthSummary", backref="month", cascade="all, delete-orphan")


class MonthSalesQuantity(Base):
    __tablename__ = "month_sales_quantity"

    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_id = Column(String(UUID_NUMBER), ForeignKey("month.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(String(UUID_NUMBER), ForeignKey("item.id"), nullable=False)
    sales_quantity = Column(Integer, nullable=False)

    item_month_sales = relationship("ItemMonthSales", backref="month_sales_quantity")

    # month_idとitem_idの組で同じ組があったらはじく
    __table_args__ = (UniqueConstraint("month_id", "item_id", name="uq_month_id_item_id"),)


class MonthMarketCommission(Base):
    __tablename__ = "month_market_commission"

    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_id = Column(String(UUID_NUMBER), ForeignKey("month.id", ondelete="CASCADE"), nullable=False)
    market_id = Column(String(UUID_NUMBER), ForeignKey("market.id"), nullable=False)
    commission = Column(Integer, nullable=False)

    market_transfer_amount = relationship("MarketTransferAmount", backref="month_market_commission")


class MonthSummary(Base):
    __tablename__ = "month_summary"

    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_id = Column(String(UUID_NUMBER), ForeignKey("month.id", ondelete="CASCADE"), nullable=False)

    item_month_sales = relationship("ItemMonthSales", backref="month_summary")
    total_market_sales = relationship("TotalMarketSales", backref="month_summary")
    market_transfer_amount = relationship("MarketTransferAmount", backref="month_summary")
    seller_market_sales = relationship("SellerMarketSales", backref="month_summary")
    seller_market_reward = relationship("SellerMarketReward", backref="month_summary")
    reward = relationship("Reward", backref="month_summary")


class ItemMonthSales(Base):
    __tablename__ = "item_month_sales"

    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_summary_id = Column(String(UUID_NUMBER), ForeignKey("month_summary.id"), nullable=False)
    month_sales_quantity_id = Column(String(UUID_NUMBER), ForeignKey("month_sales_quantity.id"), nullable=False)
    total_sales = Column(Integer, nullable=False)


class TotalMarketSales(Base):
    __tablename__ = "total_market_sales"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_summary_id = Column(String(UUID_NUMBER), ForeignKey("month_summary.id"), nullable=False)
    market_id = Column(String(UUID_NUMBER), ForeignKey("market.id"), nullable=False)
    total_market_sales = Column(Integer, nullable=False)

    market_transfer_amount = relationship("MarketTransferAmount", backref="total_market_sales")


class MarketTransferAmount(Base):
    __tablename__ = "market_transfer_amount"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_summary_id = Column(String(UUID_NUMBER), ForeignKey("month_summary.id"), nullable=False)
    total_market_sales_id = Column(String(UUID_NUMBER), ForeignKey("total_market_sales.id"), nullable=False)
    month_market_commission_id = Column(String(UUID_NUMBER), ForeignKey("month_market_commission.id"), nullable=False)
    transfer_amount = Column(Integer, nullable=False)


class SellerMarketSales(Base):
    __tablename__ = "seller_market_sales"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_summary_id = Column(String(UUID_NUMBER), ForeignKey("month_summary.id"), nullable=False)
    seller_id = Column(String(UUID_NUMBER), ForeignKey("seller.id"), nullable=False)
    market_id = Column(String(UUID_NUMBER), ForeignKey("market.id"), nullable=False)
    seller_total_sales = Column(Integer, nullable=False)

    seller_market_reward = relationship("SellerMarketReward", backref="seller_market_sales")


class SellerMarketReward(Base):
    __tablename__ = "seller_market_reward"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_summary_id = Column(String(UUID_NUMBER), ForeignKey("month_summary.id"), nullable=False)
    seller_market_sales_id = Column(String(UUID_NUMBER), ForeignKey("seller_market_sales.id"), nullable=False)
    reward_amount = Column(Integer, nullable=False)
    reward_ratio = Column(Float, nullable=False)


class Reward(Base):
    __tablename__ = "reward"
    id = Column(String(UUID_NUMBER), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    month_summary_id = Column(String(UUID_NUMBER), ForeignKey("month_summary.id"), nullable=False)
    seller_id = Column(String(UUID_NUMBER), ForeignKey("seller.id"), nullable=False)
    reward_amount = Column(Integer, nullable=False)
