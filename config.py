from dataclasses import dataclass
import json

@dataclass
class Config:
    host : str
    port : int
    db_url : str

    @staticmethod
    def load_from_json(path: str):
        with open(path, 'r') as file:
            config = json.load(file)

        return Config(
               host=config['host'],
               port=int(config['port']),
               db_url=config['db_url']
            )