const colors = {'Red': '#e6686c', 'Green': '#a4ca7b', 'Blue': '#009bd4', 'Yellow': '#f9cd61'};

var socket = io();
var id = 0;

var roomId = document.URL.split("/")[4];
var username = localStorage.getItem("username");

socket.on('connect', function() {
  id = socket.io.engine.id;
  socket.emit('join', {"room": roomId, 'username': username, 'id':id});
});


socket.on('joined', function(data) {
  var p = $('<p class="player"></p>');
  p.html(data["username"]+'#'+data["id"]);
  $("#players").append(p)
});


socket.on('add-to-hand', function(data) {
  create_card(data['color'], data['number'])
});

function create_card(color ,number)
{
  var card = $('<div class="card"></div>');
  card.html(number)
  card.css("background-color", colors[color]);
  card.on('click', function () {
    this.remove();
  });
  $("#hand").append(card)
}

function send(head, data){
    socket.emit(head, {"data": data});
}
