import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client'
import './css/Room.css';

let socket
let roomId
let playerId;

const Player = ({username, id}) => {
  return (
    <div class="player">
      <p>{username}#{id}</p>
      <p>Number of cards: ?</p>
    </div>
  )
}

const Card = ({color, number}) => {
  const colors = {"Red": "#e5676b", "Green": "#a4ca7b", "Blue": "#009bd4", "Yellow": "#f9cd61"}

  function play() {
    socket.emit("play-card", {'id': playerId, 'room': roomId, 'color': color, 'number': number})
  }

  return (
    <div class="card" onClick={() => {play()} } style={{backgroundColor: colors[color]}}>{number}</div>
  )
}


const Room = ({match, location}) => {
  const [room, setRoom] = useState();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [stash, setStash] = useState({"color": "Red", "number": 4});

  roomId = match.params.id;

  let count = 0;
  //fetch(`/room/${roomId}`).then(res => res.json().then(data => setRoom(data)))

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on('connect', () => {
      playerId = socket.io.engine.id;
      socket.emit('join', {"room": roomId, 'username': "username", 'id':playerId});
    });


    socket.on('joined', function(data) {
      console.log(`player ${data["username"]}#${data["id"]} joined the room`)
      setPlayers(oldPlayers => [...oldPlayers, {"username": data["username"], "id": data["id"]}])
    });


    socket.on('add-to-hand', function(card) {
      setHand(oldCards => [...oldCards, card])
    })

    socket.on('add-to-stash', function(card) {
      setStash(card)
    })

    /*
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
    }*/



    return () => socket.close()
  }, [])


  //<Player username={player.username} id={player.id}/>

  return (
    <div>
      <h1>Room #{roomId}</h1>
      <Link id="home-button" to="/">
         <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Back-Arrow-Icon-PNG.png" alt='Go Back' width="150" height="150"/>
      </Link>

      <div id="players">
        {players.map(player => {
          return <Player username={player.username} id={player.id}/>
        })}
      </div>

      <div id="stash">
        <Card color={stash.color} number={stash.number}/>
      </div>

      <div id="hand">
        {hand.map(card => {
          return <Card color={card.color} number={card.number}/>
        })}
      </div>


    </div>
  );

}

export default Room
