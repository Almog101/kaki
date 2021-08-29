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

    def data(self):
        return {"id": self.id, "players": [(player.username, player.id) for player in self.players.values()], "current_card": self.current_card}
