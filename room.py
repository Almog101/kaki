from secrets import token_hex
from card import *

def get_uniqe_id(rooms):
    """
    Gets unique ID for a room
    """
    while True:
        id = token_hex(10)

        if not room_exists(rooms, id):
            return id

def room_exists(rooms, room_id):
    """
    Checks if room exists in a room list by its ID
    """
    for room in rooms:
        if room.id == room_id:
            return True
    return False

class Room:
    def __init__(self, id):
        self.id = id
        self.deck = create_deck()

    def __repr__(self):
        return f"Room: id - {self.id}"
