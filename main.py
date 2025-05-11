from flask import Flask, request, jsonify, render_template

from models import *
from db import *
from config import *
from sqlalchemy.orm import Session

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/score/", methods=["POST"])
def create_score():
    score_data = request.get_json()
    score_request = ScoreRequest(**score_data)
    if (len(score_request.name) >= 300):
        return "Unprocessable entity", 422
    with Session(get_engine(config.db_url)) as session:
        ScoreRepository.create_record(session, score_request)
    return "Created", 201

@app.route("/score/<int:count>/<order>/", methods=['GET'])
def get_score(count, order):
    with Session(get_engine(config.db_url)) as session:
        result = ScoreRepository.get_records(session, count, order)
    return jsonify(result.model_dump())

# Init application
config: Config = Config.load_from_json("config.json")
ScoreRepository.init_db(get_engine(config.db_url))

if __name__ == "__main__":
    app.run(host=config.host, port=config.port)