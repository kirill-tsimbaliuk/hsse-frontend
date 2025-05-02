from sqlalchemy.orm import Mapped
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy import select, Engine
from functools import lru_cache
import time

from models import *
from config import *

class Base(DeclarativeBase):
    pass

class ScoreRecords(Base):
    __tablename__ = "score_records"

    id : Mapped[int] = mapped_column(primary_key=True)
    name : Mapped[str] = mapped_column(nullable=False)
    score : Mapped[int] = mapped_column(nullable=False)
    time : Mapped[int] = mapped_column(nullable=False)

class ScoreRepository:

    @staticmethod
    def create_record(session : Session, request : ScoreRequest) -> None:
        record = ScoreRecords(
            name = request.name,
            score = request.score,
            time = int(time.time()),
        )
        session.add(record)
        session.commit()

    @staticmethod
    def get_records(session : Session, count : int) -> RecordList:
        result = session.scalars(select(ScoreRecords).order_by(ScoreRecords.score.desc(), ScoreRecords.time.desc()).limit(count))
        records = []
        for record in result:
            records.append(Record(name=record.name, score=record.score, time=record.time))
        return RecordList(records=records)

    @staticmethod
    def init_db(engine : Engine) -> None:
        Base.metadata.create_all(engine)


@lru_cache(maxsize=1)
def get_engine(db_url : str) -> Engine:
    return create_engine(db_url)
