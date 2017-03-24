import React from 'react';
import * as helper from './Helper';
import './Game-text.css';


export const GameText = (props) => {
  const { seq, players, rounds, rows } = props;
  let round = rounds[seq];
  let row = rows[round.id];
  let text = "";

  let estimateStat = helper.getRowStat(round,"estimate",0,rows);
  let actualStat = helper.getRowStat(round,"actual",0,rows);

  if (actualStat.count === players.length) {
    // There might be more than one winner of the round.
    let winners = [];
    let point = -1000;

    // Figure out who won the round
    row.forEach(({estimate, actual},index) => {
      const playerScore = helper.calculateRoundScore(estimate,actual);
      if (playerScore === point) {
        winners.push(players[index]);
      }
      if (playerScore > point) {
        winners = [players[index]];
        point = playerScore;
      }
    });

    text = `${helper.asNormalizedText(winners)} vinder runden med ${point} point`;
  } else if (estimateStat.count === players.length) {
    const diff = estimateStat.total - round.roundId;
    if (diff > 0) {
      text = `Runden går ${diff} stik over`;
    } else {
      text = `Runden går ${Math.abs(diff)} stik under`;
    }
  } else if (estimateStat.count === players.length - 1) {
      const diff = estimateStat.total - round.roundId;
      // Figure out who has not yet estimated
      const pos = row.findIndex(({estimate}) => {
        return estimate === -1;
      });
      const remainingPlayer = players[pos];
      if (estimateStat.total <= round.roundId) {
        text = `${remainingPlayer} må ikke estimere ${Math.abs(diff)} stik`;
      } else {
        text = `${remainingPlayer} må estimerer frit`;
      }

  } else {
    const diff = round.roundId - estimateStat.total;
    if (diff >= 0) {
      text = `${diff} af ${round.roundId} stik tilbage`;
    } else {
      text = "Ingen stik tilbage";
    }
  }

  return (
    <div className="game-text">
      <p>{text}</p>
    </div>
  )

};
