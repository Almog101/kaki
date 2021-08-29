import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client'
import './css/Room.css';

let socket
let roomId
let playerId;

const Player = ({current, username, id}) => {
  return (
    <div className={ (current) ? "player current" : "player"}>
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
    <div className="card" onClick={() => {play()} } style={{backgroundColor: colors[color]}}>{number}</div>
  )
}


const Room = ({match, location}) => {
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [stash, setStash] = useState({"color": "Red", "number": 4});
  const [currentPlayer, setCurrentPlayer] = useState(0);

  let username = sessionStorage.getItem("username");
  if (username === undefined || username === "") {
    localStorage.setItem("username", "noob");
    username = "noob";
  }

  roomId = match.params.id;

  useEffect(() => {
    const sendDisconnect = e => {
      socket.emit('disconnect-from-room', {"room": roomId, 'username': username, 'id':playerId});
      console.log(socket, "disconnected");
    }

    window.addEventListener('beforeunload', sendDisconnect)
    /*return () => {
      window.removeEventListener('beforeunload', sendDisconnect)
    }*/
  }, [])


  useEffect(() => {
    fetch(`/room/${roomId}`).then(
      res => res.json().then(
        room_data => {
          console.log(room_data);
          if (room_data.status === 400) {
            window.location = "/";
          }
          room_data.room.players.forEach(player => add_player_to_list(player[0], player[1]));
          setStash(room_data.room.current_card);
          if (room_data.room.current_player !== 0)
          {
            setCurrentPlayer(room_data.room.current_player);
          }
        }
      )
    )

    function add_player_to_list(username, id) {
        setPlayers(oldPlayers => [...oldPlayers, {"username": username, "id": id}])
    }

    socket = io("http://localhost:5000");

    socket.on('connect', () => {
      playerId = socket.io.engine.id;
      socket.emit('join', {"room": roomId, 'username': username, 'id':playerId});
    });

    socket.on('joined', function(data) {
      console.log(`player ${data["username"]}#${data["id"]} joined the room`)
      add_player_to_list(data["username"], data["id"])
    });

    socket.on('add-to-hand', function(card) {
      setHand(oldCards => [...oldCards, card])
    })

    socket.on('add-to-stash', function(card) {
      setStash(card)
    })

    socket.on('player-disconnected', function(player) {
      console.log(`${player.username}# ${player.id} disconnected`);
      var newPlayers = [];

      players.forEach((p) =>{
        if (p.id !== player.id)
        {
          newPlayers.push(p);
        }
      })

      setPlayers(newPlayers);
    })

    socket.on('set-current-player', function(player) {
        setCurrentPlayer(player);
    })

    return () => socket.close()
  }, [])





  //<Player username={player.username} id={player.id}/>

  return (
    <div>
      <h1>Room #{roomId}</h1>
      <h3>{players.length} players</h3>
      <p>{currentPlayer.username}#{currentPlayer.id}</p>

      <Link id="home-button" to="/">
         <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Back-Arrow-Icon-PNG.png" alt='Go Back' width="150" height="150"/>
      </Link>

      <div id="players">
        {players.map(player => {
          return <Player current={currentPlayer.id === player.id} key={`${player.username}#${player.id}`} username={player.username} id={player.id}/>
        })}
      </div>

      <div id="stash">
        <Card color={stash.color} number={stash.number}/>
      </div>

      <div id="hand">
        {
          hand.map((card, index) => {
          return <Card key={index} color={card.color} number={card.number}/>
        })}
      </div>


    </div>
  );

}

export default Room
