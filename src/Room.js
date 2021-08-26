import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client'

let socket

const Room = ({match, location}) => {
  const [room, setRoom] = useState();
  const [messages, setMessages] = useState([]);

  const roomId = match.params.id;

  let count = 0;
  let playerId;
  //fetch(`/room/${roomId}`).then(res => res.json().then(data => setRoom(data)))

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on('connect', () => {
      playerId = socket.io.engine.id;
      socket.emit('join', {"room": roomId, 'username': "username", 'id':playerId});
    });


    socket.on('msg', (data)=>{
      console.log(count, data);
      receivedMessage(data.msg);
      count += 1;
    })

    function receivedMessage(message) {
      setMessages(oldMsgs => [...oldMsgs, message])
    }

    return () => socket.close()
  }, [])






  /*
  if (socket !== undefined)
  {
    socket.on('joined', function(data) {
      var p = $('<p class="player"></p>');
      p.html(data["username"]+'#'+data["id"]);
      $("#players").append(p)
    });

    socket.on('add-to-hand', function(data) {
      var card = create_card(data['color'], data['number']);
      card.attr("class", 'card in-hand')

      card.on('click', function () {
        socket.emit("play-card", {'id':id, 'room': roomId, 'color':data['color'], 'number':data['number']})
        this.remove();
      });

      $("#hand").append(card)
    });


    socket.on('add-to-stash', function(data) {
      var card = create_card(data['color'], data['number']);
      $("#stash").children().remove()
      $("#stash").append(card)
    });


    function create_card(color ,number)
    {
      var card = $('<div class="card"></div>');
      card.html(number)
      card.css("background-color", colors[color]);
      return card;
    }
  }
  */

  /*

  */

  return (
    <div>
      <h1>Room {roomId}</h1>
      <Link to="/">Go Back</Link>
      <button onClick={() => {socket.emit("message", {"msg":"this is a message from react", "roomId":roomId}); console.log("sent message")}}>Send Message</button>

      {messages.map(message => {
        return (<h1>{message}</h1>)
      })}
    </div>
  );

}

export default Room
