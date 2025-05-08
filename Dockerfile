FROM 3.12.10-alpine3.21

RUN mkdir app
COPY . /app
WORKDIR /app

RUN apt update
RUN python3 -m pip install requirements.txt