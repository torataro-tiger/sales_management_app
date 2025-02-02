from insert_data import INSERT_DATA
from models.models import Base
from settings import DB_URL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(DB_URL, echo=True)


def reset_database() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def insert_initial_data() -> None:
    # セッションを作成
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    try:
        session.add_all(INSERT_DATA)
        session.commit()
        print("初期データを挿入しました。")
    except Exception as e:
        session.rollback()
        print(f"初期データの挿入中にエラーが発生しました: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    reset_database()
    insert_initial_data()
