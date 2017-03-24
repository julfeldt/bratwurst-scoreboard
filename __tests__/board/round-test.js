import React from 'react';
import * as Fixture from "../fixtures";

let actual;
let estimate;

test('Round has a round number', () => {
	const round = Fixture.renderRound();
	const roundId = parseInt(round.find(".round-id").text());
	expect(roundId).toEqual(Fixture.roundId);
});

test('Round score when estimate and actual do not match (1)', () => {
	actual = 1;
	estimate = 2;
	Fixture.setRoundValues(estimate,actual);

	const round = Fixture.renderRound();

	expect(getScore(round)).toEqual(actual-estimate);
});

test('Round score when estimate and actual do not match (2)', () => {
	actual = 2;
	estimate = 5;
	Fixture.setRoundValues(estimate,actual);

	const round = Fixture.renderRound();

	expect(getScore(round)).toEqual(actual-estimate);
});

test('Round score when estimate and actual do match', () => {
	actual = 2;
	estimate = 2;
	Fixture.setRoundValues(estimate,actual);

	const round = Fixture.renderRound();

	const expected = Math.pow(actual,2) + 10;
	expect(getScore(round)).toEqual(expected);
});

/* Helpers */
let getScore = (round) => {
	return parseInt(round.find(".round-score").text());
}