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
    print(request.name, request.score)
    with Session(get_engine()) as session:
        ScoreRepository.create_record(session, request)
    return Response(status_code=200)

@app.get("/score/{count}/", response_model=RecordList)
async def get_score(count : int):
    with Session(get_engine()) as session:
        result = ScoreRepository.get_records(session, count)
    return result

# Init application
if __name__ == "__main__":
    config : Config = Config.load_from_json("config.json")
    ScoreRepository.init_db(get_engine())
    uvicorn.run(app, host=config.host, port=config.port)
