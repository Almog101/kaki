import './css/App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home.js';
import Room from './Room.js';

function App() {

  return (
    <Router>
      <div className="App">
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/room/:id" component={Room}/>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
