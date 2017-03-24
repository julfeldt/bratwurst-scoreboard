import React, { Component } from 'react';
import { browserHistory } from 'react-router'
const FontAwesome = require('react-fontawesome');
import './Game-menu.css';
import './vendor/font-awesome.min.css';

const maxPlayerCount = 4;
const minPlayerCount = 2;

export class GameMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerCount: maxPlayerCount
    };
    this.increasePlayerCount = this.increasePlayerCount.bind(this);
    this.decreasePlayerCount = this.decreasePlayerCount.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  increasePlayerCount() {
    const playerCount = this.state.playerCount;
    if (playerCount < maxPlayerCount) {
      this.setState({playerCount: this.state.playerCount + 1});
    }
  }

  decreasePlayerCount() {
    const playerCount = this.state.playerCount;
    if (playerCount > minPlayerCount) {
      this.setState({playerCount: this.state.playerCount - 1});
    }
  }

  startGame() {
    const playerCount = this.state.playerCount;
    const playerNames = [];
    const playerNameLimit = 10;
    for (let i = 1 ; i < playerCount + 1 ; i++) {
      let input = document.querySelector("input[name='player-"+i+"']");
      let playerName = input.value || input.placeholder;
      if (playerName.length > playerNameLimit) {
        playerName = playerName.substring(0,playerNameLimit) + "...";
      }
      playerNames.push(playerName);
    }
    this.props.route.onStartGame(playerNames);
    browserHistory.push("board");
  }

  render() {

    let players = [];
    const playerCount = this.state.playerCount;
    /*
    for (let i = 1 ; i < playerCount + 1 ; i++ ) {
      players.push(<input key={i} disabled="true" type="text" name={`player-${i}`} defaultValue="" placeholder={`Player #${i}`}/>);
    }
    */
    for (let i = 1 ; i < maxPlayerCount+1 ; i++ ) {
      players.push(<input key={i} disabled={i > playerCount} type="text" name={`player-${i}`} defaultValue="" placeholder={`Spiller #${i}`}/>);
    }

    return (
      <div className="wrapper-menu">
        <div className="padding player-count">{playerCount} Spillere</div>
        <div className="player-names">
          {players}
        </div>
        <div className="padding buttons">
          <button disabled={playerCount === minPlayerCount} type="button" className="player-count-button" onTouchEnd={() => this.decreasePlayerCount()} onClick={() => this.decreasePlayerCount()}>
            <FontAwesome name="minus"/>
          </button>
          <button disabled={playerCount === maxPlayerCount} type="button" className="player-count-button" onTouchEnd={() => this.increasePlayerCount()} onClick={() => this.increasePlayerCount()}>
            <FontAwesome name="plus"/>
          </button>
          <button type="button" className="start-game-button" onTouchEnd={() => this.startGame()} onClick={() => this.startGame()}>
            <FontAwesome name="play"/>
          </button>
        </div>
      </div>
    )
  }

};
