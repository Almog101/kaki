from flask import Flask, render_template, redirect, url_for, Response, jsonify
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import *

STARTING_CARDS = 8
NAME_ID_LENGTH = 4


app = Flask(__name__)
socketio = SocketIO(app)
rooms = {}

@app.route("/index")
@app.route("/")
def main():
    return jsonify(status=200, data="Hello User")


@app.route("/room/<room_id>")
def room(room_id):
    if not room_id in rooms:
        return Response(response="Room does not exist",status=400)
    return jsonify(status=200, room=rooms[room_id].json()) #Response(response = str(rooms[room_id].to_json()), status=200) #, mimetype='application/json'

@app.route("/get-rooms")
def get_rooms():
    if len(rooms) == 0:
        return jsonify(status=404, data=[]) # no rooms created
    return jsonify(status=200, data = list(rooms.keys()))

@app.route("/create-room")
def create_room():
    id = get_uniqe_id(rooms, 10)
    room = Room(id = id)
    rooms[id] = room

    return jsonify(status=200, roomId=id)

# SocketIO functions


@socketio.on('connect')
def connected():
    print("Player connected")

@socketio.on('join')
def join(data):
    room_id = data['room']
    username = data['username']

    if 'id' not in data:
        return -1

    id = data['id']

    if room_id not in rooms:
        return -1

    room = rooms[room_id]
    new_player = Player(username, id)
    new_player.hand = room.deck.get_cards(STARTING_CARDS)
    room.players[id] = new_player

    join_room(room_id)


    emit("joined", {"username": username, "id": id}, to=room_id)

    for card in new_player.hand:
        emit("add-to-hand", card.to_json())


@socketio.on('play-card')
def play_card(data):
    color = data['color']
    number = data['number']
    room_id = data['room']

    emit("add-to-stash", {"color": color, "number": number}, to=room_id)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + str(data))


if __name__ == '__main__':
    socketio.run(app, debug=True)