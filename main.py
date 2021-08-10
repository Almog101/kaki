
from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO, send, emit

from room import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
rooms = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/room/<room_id>")
def room(room_id):
    if not room_exists(rooms, int(room_id)):
        return redirect(url_for("index"))
    return room_id

@app.route("/create-room")
def create_room():
    room = Room(id = get_uniqe_id(rooms))
    rooms.append(room)

    print(room)

    return redirect(url_for("room", room_id=room.id))

"""
@socketio.on('command')
def handle_message(data):
    print('received message: ' + str(data))
    output = server.send(data["userid"], data["command"])
    emit("output", output)
"""

if __name__ == '__main__':
    socketio.run(app, debug=True)
