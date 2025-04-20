from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn 

app = FastAPI()
 
app.mount("/static", StaticFiles(directory="static"))
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", { "request" : request})

@app.post("/score/")
async def score():
    return Response()

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)