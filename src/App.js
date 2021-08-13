import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainMenu from './MainMenu.js';
import Background from './Background.js';
import React, {useEffect, useState} from 'react';


function App() {
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
    <div className="App">
      <Background/>
      <MainMenu/>
      {(rooms == undefined) ? () => {<h1>Loading Rooms...</h1>} : rooms.data.map((room) => (
        <a href={"http://127.0.0.1:5000/room/" + room}>{room} </a>
      ))}
    </div>
  );
}

export default App;
