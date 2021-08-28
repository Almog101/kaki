from flask import Flask, render_template, redirect, url_for, Response, jsonify
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import *
from dataclasses import asdict

STARTING_CARDS = 8
NAME_ID_LENGTH = 4


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
rooms = {}

@app.route("/room/<room_id>")
def room(room_id):
    if not room_id in rooms:
        return jsonify(status=400, response="Room does not exist")
    return jsonify(status=200, room = rooms[room_id].data())

@app.route("/get-rooms")
def get_rooms():
    if len(rooms) == 0:
        return jsonify(status=404, data=[]) # no rooms created
    return jsonify(status=200, data = list(rooms.keys()))

@app.route("/create-room")
def create_room():
    room = Room()
    rooms[room.id] = room
    print(rooms)

    return jsonify(status=200, roomId=room.id)

# SocketIO functions

@socketio.on('join')
def join(data):
    room_id = data['room']
    username = data['username']

    if 'id' not in data:
        return -1

    if room_id not in rooms:
        return -1

    id = data['id']

    print(f"{username}#{id}", "joined room", room_id)

    room = rooms[room_id]
    new_player = Player(username, id)
    new_player.hand = room.deck.get_cards(STARTING_CARDS)
    room.players[id] = new_player

    join_room(room_id)

    emit("joined", {"username": username, "id": id}, to=room_id)

    for card in new_player.hand:
        emit("add-to-hand", asdict(card))


@socketio.on('play-card')
def play_card(data):
    player_id, room_id, color, number = data.values()

    rooms[room_id].current_card = Card(color=color, number=number)

    emit("add-to-stash", {"color": color, "number": number}, to=room_id)

if __name__ == '__main__':
    socketio.run(app, debug=True)
