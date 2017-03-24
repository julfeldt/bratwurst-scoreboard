import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import {Board} from './App';
import Home from './Home';
import {GameMenu} from './Game-menu';
import './index.css';
import { generateBoardState } from './Helper';

// Disable scrolling
/*
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
});
*/

let boardState = generateBoardState();

function startGame(players) {
	boardState.players = players;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}>
	  <IndexRoute component={GameMenu} onStartGame={(players) => startGame(players)}/>
      <Route path="/board" board={boardState} component={Board}/>
    </Route>
  </Router>
), document.getElementById('root'))