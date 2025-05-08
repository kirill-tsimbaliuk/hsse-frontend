from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn 

from models import *
from db import *
from config import *

app = FastAPI()

# Init routes
app.mount("/static", StaticFiles(directory="static"))
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", { "request" : request})

@app.post("/score/")
async def create_score(request: ScoreRequest):
    with Session(get_engine(config.db_url)) as session:
        ScoreRepository.create_record(session, request)
    return Response(status_code=200)

@app.get("/score/{count}/{order}", response_model=RecordList)
async def get_score(count: int, order: str):
    with Session(get_engine(config.db_url)) as session:
        result = ScoreRepository.get_records(session, count, order)
    return result

# Init application
config : Config = Config.load_from_json("config.json")
ScoreRepository.init_db(get_engine(config.db_url))

if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=config.port)
