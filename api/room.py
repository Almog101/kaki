from secrets import token_hex
from card import *
import json

def get_uniqe_id(dict, n):
    """
    Generates unique ID from a dictionary of IDs of N length
    """
    while True:
        id = token_hex(n)

        if not id in dict:
            return id

class Player:
    def __init__(self, username, id):
        self.id = id
        self.username = username
        self.hand = []

    def json(self):
        return {"username": self.username, "id": self.id}


class Room:
    def __init__(self, id):
        self.id = id
        self.deck = Deck()
        self.players = {}

    def json(self):
        return {"id": self.id, "players": [player.json() for player in self.players]}

    def __repr__(self):
        return f"Room: id - {self.id}"
