import random
from dataclasses import dataclass

class Deck(list):
    def __init__(self, *args):
        super().__init__(self, *args)
        self.generate_deck()

    def generate_deck(self):
        """
        Generates a new deck
        """
        for _ in range(2):
            for color in ["Red", "Blue", "Green", "Yellow"]:
                for number in range(10):
                    self.append(Card(color = color, number = number))

    def get_cards(self, n):
        """
        Gets N cards from the deck and removes them
        """
        cards = []
        for _ in range(n):
            if len(self) == 0:
                self.generate_deck()
            cards.append(self.pop(random.randint(0, len(self)-1)))
        return cards


@dataclass(frozen=True, order=True)
class Card:
    color: str
    number: int
