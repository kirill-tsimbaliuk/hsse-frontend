from pydantic import BaseModel
from typing import List

class ScoreRequest(BaseModel):
    name: str
    score: int

class Record(BaseModel):
    name : str
    score : int
    time : int 

class RecordList(BaseModel):
    records : List[Record]
