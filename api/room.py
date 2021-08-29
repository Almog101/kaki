from dataclasses import dataclass, field, asdict
from card import Deck, Card
import itertools
import random

@dataclass()
class Player:
    id: str
    username: str
    hand: list = field(default_factory=list)

    def details(self):
        return {"username": self.username, "id": self.id}


@dataclass()
class Room:
    id_iter = itertools.count(start = random.random(), step = random.random())

    id: str = field(default="")
    players: dict = field(default_factory=dict)
    deck: Deck = field(default_factory = Deck, repr=False, metadata={"include_in_dict":True})
    current_card: Card = field(default=Card(number=1, color="Blue"))

    def __post_init__(self):
        self.id = hex(hash(next(self.id_iter)))[2:]
        self.current_card = self.deck.get_cards(1)
        self.current_player = 0

    def next_player(self):
        players_ids = list(self.players.keys())
        index = players_ids.index(self.current_player)
        self.current_player = players_ids[(index + 1) % len(players_ids)]

    def data(self):
        return {"id": self.id, "players": [(player.username, player.id) for player in self.players.values()], "current_card": self.current_card, "current_player": 0 if self.current_player == 0 else self.players[self.current_player].details()}
