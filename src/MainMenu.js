const MainMenu = ()  => {

  const createRoom = () => {
    fetch("/create-room").then(res => res.json().then(data => {window.location.href = `/room/${data.roomId}`}))
  }

  return (
    <div className="MainMenu">
      <h1>Kaki - knock of Taki (Jewish Version of Uno)</h1>

      <input type="text" id="username" name="username" placeholder="Enter Username"/>
      <button onClick={() =>{createRoom()}}>Create Room</button>
    </div>
  );
}



export default MainMenu;
