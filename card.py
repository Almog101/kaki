import random

def get_card(Deck):
    """
    Gets a card from the deck and removes it
    """
    return Deck.pop(randint(0, len(Deck)))

def create_deck():
    """
    Generates a new deck
    """
    deck = []
    for _ in range(2):
        for color in ["Red", "Blue", "Green", "Yellow"]:
            for number in range(10):
                deck.append(Card(color = color, number = number))
    return deck


class Card:
    def __init__(self, color, number):
        self.color = color
        self.number = number

    def __repr__(self):
        return f"Card - {self.color} {self.number}"
