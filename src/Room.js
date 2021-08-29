import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client'
import './css/Room.css';

let socket
let roomId
let playerId;
let hands_length;

const Player = ({current, username, id}) => {
  return (
    <div className={ (current) ? "player current" : "player"}>
      <p>{username}#{id}</p>
      <p>Number of cards: ?</p>
    </div>
  )
}

const Card = ({index=0, inhand=false, isdeck=false, color, number}) => {
  const colors = {"Red": "#e5676b", "Green": "#a4ca7b", "Blue": "#009bd4", "Yellow": "#f9cd61", "Brown": "#1d140e"}

  let style = {
    backgroundColor: colors[color],
  }

  if (inhand)
  {
    const start = 10;
    const end = 90;
    style["left"] = ((end-start)/hands_length * index + start).toFixed(1) + "%";
  }

  function play() {
    if (inhand) {
      socket.emit("play-card", {'id': playerId, 'room': roomId, 'color': color, 'number': number})
    }
    else {
      console.log("You can't click on that dumby");
    }
  }

  function draw() {
    socket.emit("draw-card", {'id': playerId, 'room': roomId})
  }

  return (
    <div className="card" onClick={() => {if(isdeck){draw()}else{play()}} } style={style}>{number}</div>
  )
}


const Room = ({match, location}) => {
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [stash, setStash] = useState({});
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
    return () => {
      window.removeEventListener('beforeunload', sendDisconnect)
    }
  }, [])


  useEffect(() => {
    fetch(`/room/${roomId}`).then(
      res => res.json().then(
        room_data => {
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

  hands_length = hand.length;

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

      <div id="deck">
        <Card isdeck={true} color={"Brown"} number={"≡"}/>
      </div>
      <div id="stash">
        {(stash === {}) ? "" : <Card color={stash.color} number={stash.number}/>}
      </div>

      <div id="hand">
        {
          hand.map((card, index) => {
          return <Card index={index} inhand={true} key={index} color={card.color} number={card.number}/>
        })}
      </div>


    </div>
  );

}

export default Room
