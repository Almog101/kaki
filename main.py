
from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import *

STARTING_CARDS = 8
NAME_ID_LENGTH = 4


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
rooms = {}

@app.route("/")
def index():
    return render_template("index.html", rooms=rooms)

@app.route("/room/<room_id>")
def room(room_id):
    if not room_id in rooms:
        return redirect(url_for("index"))
    return render_template("room.html", room=rooms[room_id])

@app.route("/create-room")
def create_room():
    id = get_uniqe_id(rooms, 10)
    room = Room(id = id)
    rooms[id] = room

    return redirect(url_for("room", room_id = id))

# SocketIO functions

@socketio.on('join')
def join(data):
    room_id = data['room']
    username = data['username']
    if room_id not in rooms:
        return -1

    room = rooms[room_id]

    id = get_uniqe_id(room.players, NAME_ID_LENGTH)
    new_player = Player(username, id)
    new_player.hand = room.deck.get_cards(STARTING_CARDS)

    room.players[id] = new_player

    join_room(room_id)
    emit("joined", {"username": username, "id": id}, to=room_id)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + str(data))


if __name__ == '__main__':
    socketio.run(app, debug=True)
