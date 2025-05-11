FROM python:3.12.10-alpine3.21

RUN mkdir app
COPY . /app
WORKDIR /app

RUN python3 -m pip install -r requirements.txt

EXPOSE 8000

ENTRYPOINT [ "python3", "main.py" ]