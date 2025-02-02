from settings import DB_URL_ASYNC
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ベースクラス
Base = declarative_base()

# 非同期エンジン作成
engine = create_async_engine(DB_URL_ASYNC, echo=True)

# 非同期セッション作成
Session = sessionmaker(  # type: ignore
    bind=engine,  # type: ignore
    class_=AsyncSession,
    expire_on_commit=False,
)


# 非同期セッションの取得
async def get_db():
    async with Session() as session:  # type: ignore
        yield session
