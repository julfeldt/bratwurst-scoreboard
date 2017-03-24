import React from 'react';
import {mount,shallow} from 'enzyme';
import {Board} from '../src/App';
import {Round} from '../src/Round';
import { generateBoardState } from '../src/helper';

const roundKey = "13-d";
export let roundId = 13;
export let playerId = 0;
export let seq = 1;
export const rounds = [];
rounds[seq] = {
	id: roundKey,
	roundId
};
export const rows = {
	[roundKey]: [
		{
			"estimate": 1,
			"actual": 2
		},
		{
			"estimate": 1,
			"actual": 3
		},
		{
			"estimate": 1,
			"actual": 4
		},
		{
			"estimate": 1,
			"actual": 5
		}
	]
};

export const players = ["A","B","C","D"];

export const renderRound = () => {
	return shallow(
   	<Round key={1}
   		players={players}
   		playerId={playerId}
   		seq={seq}
   		rounds={rounds}
   		rows={rows}
   		changeEstimate={() => console.log(1)}
   		changeActual={() => console.log(2)} />
  	);
}

export const renderBoard = (board = generateBoardState()) => {
	return mount(<Board board={board}/>);
}

/* Utility - move to util ? */

export const setRoundValues = (estimate,actual) => {
	rows[roundKey][0] = { estimate, actual };
}

// We do this pseudo test since excluding tests did not work correctly.
test('Setup fixture', () => {
	expect(true).toBe(true);
});
