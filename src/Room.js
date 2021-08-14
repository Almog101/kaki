import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client'

let socket;

const Room = ({match, location}) => {
  const roomId = match.params.id;
  const endpoint = "http://localhost:5000";

  useEffect(() => {
    socket = io(endpoint);
    console.log(socket, location);
  }, [endpoint, location.search])

  return (
    <div>
      <h1>Room {roomId}</h1>
      <Link to="/">Go Back</Link>
    </div>
  );

}

export default Room
