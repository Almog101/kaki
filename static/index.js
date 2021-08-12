const source = document.getElementById('username');

source.value = localStorage.getItem("username");

const inputHandler = function(e) {
  localStorage.setItem("username", e.target.value);
}
source.addEventListener('input', inputHandler);
source.addEventListener('propertychange', inputHandler); // for IE8
// Firefox/Edge18-/IE9+ don’t fire on <select><option>
// source.addEventListener('change', inputHandler);
