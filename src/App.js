import React, { Component } from 'react';
import './App.css';
import {GameText} from './Game-text';
import {Round} from './Round';
import {ButtonsBar} from './Buttons-bar';
import { browserHistory } from 'react-router'
import * as localStorageHelper from './LocalStorageHelper';



export class Board extends Component {

  constructor(props) {
    super(props)
    // Hack to make tests work
    this.state = localStorageHelper.getBoardState() || (props.board || props.route.board);

    this.handleNextRound = this.handleNextRound.bind(this);
    this.handlePreviousRound = this.handlePreviousRound.bind(this);
    this.changeEstimate = this.changeEstimate.bind(this);
    this.changeActual = this.changeActual.bind(this);

    localStorageHelper.setBoardState(this.state);
  }

  handleNextRound(){
    this.setState({
      seq: this.state.seq + 1
    });
  }

  handlePreviousRound(){
    this.setState({
      seq: this.state.seq - 1
    });
  }

  newGame() {
    if (confirm("Slet nuværende spil?")) {
        localStorageHelper.removeBoardState();
        // Go back to menu
        browserHistory.push("/");
    }
  }

  changeEstimate(value,roundId,playerId) {
    this.changeValue(value,roundId,playerId,"estimate");
  }

  changeActual(value,roundId,playerId) {
    this.changeValue(value,roundId,playerId,"actual");
  }

  changeValue(valueStr,roundId,playerId,key) {
    let { rows } = this.state;
    let value = parseInt(valueStr,10);

    let obj = Object.assign({}, rows[roundId][playerId], {[key]: value, "reset": value  === -1});
    let row = [...rows[roundId]];
    let updatedRows = Object.assign({}, rows, {
      [roundId]: [
        ...row.slice(0,playerId),
        obj,
        ...row.slice(playerId+1)
      ]
    });

    // Reset the reset-flag, so auto fill works again.
    if (value !== -1) {
      let players = [];
      for (let i = 0 ; i < this.state.players.length ; i++) {
        if (i === playerId) {
          players.push(Object.assign({}, rows[roundId][i], {[key]: value, "reset": false}));
        } else {
          players.push(Object.assign({}, rows[roundId][i], {"reset": false}));
        }
      }
      updatedRows = Object.assign({}, rows, {
        [roundId]: players
      });
    } else {
      if (key === "actual") {
          let players = [];
          for (let i = 0 ; i < this.state.players.length ; i++) {
            players.push(Object.assign({}, rows[roundId][i], {actual: value, "reset": true}));
          }
          updatedRows = Object.assign({}, rows, {
            [roundId]: players
          });
      }
    }

    this.setState({
      "rows": updatedRows
    })
  }

  componentWillUpdate(nextProps, nextState){
    localStorageHelper.setBoardState(nextState);
  }


  render() {
    let rounds = [];
    for (var i = 0; i < this.state.players.length ; i++) {
      rounds.push(<Round key={i} players={this.state.players} playerId={i} seq={this.state.seq} rounds={this.state.rounds} rows={this.state.rows} changeEstimate={this.changeEstimate} changeActual={this.changeActual} />);
    }

    let nextRoundButton = this.state.seq < this.state.rounds.length - 1 ;
    let previousRoundButton = this.state.seq > 0;

    // TODO: use column mode to stack correctly

    return (
        <div className="app">
            <div className="use-landscape">
              <img className="ipad" src="images/ipad-landscape.png" alt="device" />
            </div>
            <div className="wrapper">
              <GameText players={this.state.players} seq={this.state.seq} rounds={this.state.rounds} rows={this.state.rows} />
              <div className="container">
                {rounds}
              </div>
              <ButtonsBar showPrevious={previousRoundButton} showNext={nextRoundButton} handlePreviousRound={this.handlePreviousRound} handleNextRound={this.handleNextRound} newGame={this.newGame}/>
            </div>
        </div>
    );
  }
}
