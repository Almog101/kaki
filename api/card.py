import random

class Deck(list):
    def __init__(self, *args):
        list.__init__(self, *args)
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


class Card:
    def __init__(self, color, number):
        self.color = color
        self.number = number

    def to_json(self):
        return {'color': self.color, 'number': self.number}

    def __repr__(self):
        return f"Card - {self.color} {self.number}"
