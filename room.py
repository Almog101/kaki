import random

def get_uniqe_id(rooms):
    """
    Gets unique ID for a room
    """
    id = random.randint(1000,10000)
    while True:
        room_id_exists = False
        for room in rooms:
            if room.id == id:
                room_id_exists = True
                break
        if not room_id_exists:
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

    def __repr__(self):
        return f"Room {self.id}"
