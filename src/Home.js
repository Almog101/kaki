import MainMenu from './MainMenu.js';
import Background from './Background.js';
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

const Home =() => {
  const [rooms, setRooms] = useState();

  useEffect(() => {
    fetch("/get-rooms").then(res =>
      res.json().then( data => {
        console.log(data)
        setRooms(data)
      })
    );
  }, []);

  return (
    <div>
    <Background/>
    <MainMenu/>
    {(rooms === undefined) ? () => {<h1>Loading Rooms...</h1>} : rooms.data.map((room) => (
      <Link key={room} to={`/room/${room}`}>{room}<br/></Link>
    ))}

    </div>
  );
}

export default Home;
