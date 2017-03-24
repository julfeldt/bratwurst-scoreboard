import React from 'react';
import * as Fixture from "../fixtures";

/* Player name */

test('Board should display player name', () => {

	Fixture.players[0] = "Anders";

	const round = Fixture.renderRound();
  	const playerName = round.find(".player-name");

	expect(playerName.text()).toEqual('Anders');
});

test('Board should display default player name if missing', () => {

	Fixture.players[0] = "";

	const round = Fixture.renderRound();
  	const playerName = round.find(".player-name");

	expect(playerName.text()).toEqual('Player '+ Fixture.playerId);
});