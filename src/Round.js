import React, { Component } from 'react';
import './Round.css';
const FontAwesome = require('react-fontawesome');
import * as helper from './Helper';


export class Round extends Component {

  componentWillReceiveProps(nextProps){
    let { playerId,changeActual,rounds,rows,seq,players } = nextProps;
    let round = rounds[seq];
    let { id, roundId } = round;
    let estimateRowStat = helper.getRowStat(round,"estimate",playerId,rows);
    let { count, total } = helper.getRowStat(round,"actual",playerId,rows);
    let { actual,reset } = rows[id][playerId];
    const playerCount = players.length;

    // autofill when actual is at total
    let actualAtTotal = total === roundId && actual === -1;
    let isManualReset = actual === -1 && reset;
    let onePlayerRemains = count === playerCount - 1;
    let allHaveEstimated = estimateRowStat.count === playerCount;

    // If the user has not manually reset the value, auto fill the last missing actual value.
    if ((!isManualReset && actualAtTotal) || (!reset && actual === -1 && allHaveEstimated && onePlayerRemains)){
      let remaining = roundId - total;
      changeActual(remaining,id,playerId);
    }
  }

  render() {

    let { seq,playerId,players, rounds,rows, changeActual, changeEstimate } = this.props;
    let round = rounds[seq];
    let { id, roundId } = round;
    let { estimate, actual } = rows[id][playerId];
    let roundScore = helper.calculateRoundScore(estimate,actual);

    let autoClass = helper.shouldHideAutoFill(round,playerId,rows, estimate, actual, players) ? "hide" : "";
    let autoImg = (
      <span>
        <a href="#" className={"thumbs-link " + autoClass} onClick={() => {
          changeActual(estimate,id,playerId);
        }}>
          <FontAwesome
                 className={"thumbs " + autoClass}
                 name='thumbs-up'
                 size='2x'
                 title="Spiller gik hjem"
               />
        </a>
      </span>
    );

    const scoreVisibilityClass = roundScore === 0 ? " hide" : " pop";
    const estimateStat = helper.getRowStat(round,"estimate",playerId,rows);
    const estimateSelectState = estimateStat.count < players.length;
    const playerScore = helper.getPlayerScore(players,playerId,rounds,rows);

    return (
      <div className="round-box">
        <div className="player-line">
          <span className="player-name">{helper.getPlayerName(players,playerId)}</span>
          <span className={"player-score " + helper.getSignClass(playerScore)}>{helper.getPlayerScore(players,playerId,rounds,rows)}</span>
        </div>
        <div className="round-main">
          <div className="header">
            <span>Round</span>
            <span>Estimat</span>
            <span>Faktisk</span>
            <span>Point</span>
          </div>
          <div className="round">
            <div className="round-id">{roundId}</div>
            <select className="select-estimate" value={estimate} onBlur={(e) => changeEstimate(e.target.value,id,playerId)} onChange={(e) => changeEstimate(e.target.value,id,playerId)}>
              {getEstimateOptions(round,"estimate",playerId,rows,players)}
            </select>
            <select disabled={estimateSelectState} className="select-actual" value={actual} onChange={(e) => changeActual(e.target.value,id,playerId)} onBlur={(e) => changeActual(e.target.value,id,playerId)}>
              {getActualOptions(round,"actual",playerId,rows,actual,players)}
            </select>
            <span className={helper.getSignClass(roundScore) + " round-score" + scoreVisibilityClass}>
              {roundScore}
            </span>
          </div>
        </div>
        {autoImg}
      </div>
  )};
}

/* Helpers */

export function getRemainderOption(round,type,playerId,rows,players) {
  let { id, roundId } = round;
  let { total, count, hasNoValue } = helper.getRowStat(round,type,playerId,rows);
  let remainder = -1;
  const playerCount = players.length;

  if (count === playerCount-1 && hasNoValue) {
    remainder =  roundId - total;
  } else if (count === playerCount) {
    rows[id].forEach((element,index) => {
      if (playerId === index) {
        let value = parseInt(element[type],10);
        remainder = (roundId - total) + value;
      }
    })
  }
  return remainder;
}

export function getEstimateOptions(round,type,playerId,rows,players) {
  let { roundId } = round;
  const exclude = getRemainderOption(round,type,playerId,rows,players);
  let items = [];
  items.push(<option key={-1} value={-1}>-</option>);
  for (var i = 0; i < roundId+1 ; i++ ){
    if (i === exclude) {
      continue;
    }
    items.push(<option key={i} value={i} >{i}</option>);
  }
  return items;
}

export function getActualOptions(round,type,playerId,rows,currentActual,players) {

  let { roundId } = round;
  const include = getRemainderOption(round,type,playerId,rows,players);
  let items = [];
  let actualStat = helper.getRowStat(round,"actual",playerId,rows);

  items.push(<option key={-1} value={-1}>-</option>);
  for (var i = 0; i < roundId+1 ; i++ ){
    if ((include !== -1 && i !== include) || (actualStat.total + i > roundId && i !== currentActual)) {
      continue;
    }
    items.push(<option key={i} value={i}>{i}</option>);
  }
  return items;
}
