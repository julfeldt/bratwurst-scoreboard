export const generateBoardState = (rowCount = 13, players = ["Player #1","Player #2","Player #3","Player #4"]) => {

	let rows = {};
	let rounds = [];
	let seq = 0;

	function generateRow(i,label) {
	  let row = [];
	  for (let j = 0; j < players.length ; j++) {
	    row.push({
	      "estimate": -1,
	      "actual": -1
	    });
	  }
	  rounds.push({
	    "id": i+label,
	    "roundId": i
	  });
	  rows[i+label] = row;
	}

	// Rows down
	for (let i = rowCount ; i > 0 ; i--) {
	  generateRow(i,"-d");
	}
	// Rows up
	for (let i = 2 ; i < rowCount+1 ; i++) {
	  generateRow(i,"-u");
	}


	/*
	rows["13-d"][0].estimate = 3;
	rows["13-d"][1].estimate = 7;
	rows["13-d"][2].estimate = 3;
	rows["13-d"][3].estimate = 3;
	rows["13-d"][0].actual = 3;
	rows["13-d"][1].actual = 3;
	rows["13-d"][2].actual = 3;
	rows["13-d"][3].actual = 4;
	*/

	return {
	  seq,
	  rows,
	  rounds,
	  players
	}
}

export const asNormalizedText = (names) => {
  let text = "";
  if (names.length > 1) {
    // Proper syntax
    text = names.slice(0,names.length-1) + " og " +names.slice(names.length-1);
  } else {
    text  = names.join("");
  }
  return text;
}

export const calculateRoundScore = (estimate,actual) => {
  if (estimate < 0 || actual < 0) {
    return 0;
  }
  if (estimate === actual) {
    return Math.pow(estimate,2) + 10;
  }
  return Math.abs(estimate-actual) * -1;
}

export const getPlayerScore = (players,playerId,rounds,rows) => {
  let score = 0;
  rounds.forEach(round => {
    const { estimate,actual } = rows[round.id][playerId];
    score += calculateRoundScore(estimate,actual);
  })
  return score;
}

export const getPlayerName = (players, playerId) => {
  return players[playerId] || "Player " + playerId;
}

export const getRowStat = ({id},type,playerId,rows) => {
  let total = 0;
  let count = 0;
  let hasNoValue = false;
  rows[id].forEach((element,index) => {
    let value = parseInt(element[type],10);
    if (value >= 0) {
      count++;
      total += value;
    }
    if (index === playerId && value === -1) {
      hasNoValue = true;
    }
  })
  return {
    hasNoValue,
    total,
    count
  }
}

export const shouldHideAutoFill = (round,playerId,rows, estimate, actual, players) => {

  let { roundId } = round;
  let actualStat = getRowStat(round,"actual",playerId,rows);
  let estimateStat = getRowStat(round,"estimate",playerId,rows);
  const playerCount = players.length;
  let estimateExceedTotal = actualStat.total + estimate >  roundId;
  let didSpecifyActual = actual !== -1;
  let didAllSpecifyActual = actualStat.count === playerCount;
  let didAllEstimate = estimateStat.count === playerCount

  return estimateExceedTotal || didAllSpecifyActual || didSpecifyActual || !didAllEstimate
}

export const getSignClass = (score) => {
  let signClass = ""
  if (score > 0) {
    signClass = "positive"
  } else if (score < 0) {
    signClass = "negative"
  }
  return signClass;
}
