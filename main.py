
from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from room import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
rooms = []

@app.route("/")
def index():
    return render_template("index.html", rooms=rooms)

@app.route("/room/<room_id>")
def room(room_id):
    if not room_exists(rooms, room_id):
        return redirect(url_for("index"))
    return render_template("room.html", room_id=room_id)

@app.route("/create-room")
def create_room():
    room = Room(id = get_uniqe_id(rooms))
    rooms.append(room)

    print(room)

    return redirect(url_for("room", room_id=room.id))

# SocketIO functions

@socketio.on('join')
def join(data):
    room_id = data['room']
    username = data['username']

    join_room(room_id)
    emit("joined", f"{username} joined room {room_id}", to=room_id)

@socketio.on('message')
def handle_message(data):
    print('received message: ' + str(data))


if __name__ == '__main__':
    socketio.run(app, debug=True)
