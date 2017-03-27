import React from 'react';
import * as Fixture from "../fixtures";
import { generateBoardState } from '../../src/Helper';

let actual;
let estimate;
let boardState;
let board;
const playerCount = 4;

beforeEach(() => {
  boardState = generateBoardState();
  board = Fixture.renderBoard(boardState);
});

test('Player score accross more rows is calculated correctly', () => {

    // Round 13
    setEstimate(0,0,3);
    setEstimate(0,1,3);
    setEstimate(0,2,3);
    setEstimate(0,3,3);
    setActual(0,0,3);
    setActual(0,1,3);
    setActual(0,2,3);
    setActual(0,3,4);

    // Round 12
    setEstimate(1,0,3);
    setEstimate(1,1,3);
    setEstimate(1,2,3);
    setEstimate(1,3,2);
    setActual(1,0,3);
    setActual(1,1,3);
    setActual(1,2,3);
    setActual(1,3,3);

    board = Fixture.renderBoard(boardState);

    function getScoreAt(pos) {
        return parseInt(board.find(".player-score").at(pos).text());
    }

    expect(getScoreAt(0)).toEqual(38);
    expect(getScoreAt(1)).toEqual(38);
    expect(getScoreAt(2)).toEqual(38);
    expect(getScoreAt(3)).toEqual(-2);
});


test('Estimate must not match', () => {
    changeEstimate(1,5);
    changeEstimate(2,5);
    changeEstimate(3,2);

    // Should not be possible to estimate 1 set ..
    expect(hasSelectEstimateOption(0,1)).toBe(false);
});


test('Autofill last one', () => {
    board = Fixture.renderBoard(getBoardState());

    expect(getActual(3)).toBe(-1);

    changeEstimate(0,2);
    changeEstimate(1,5);
    changeEstimate(2,5);
    changeEstimate(3,2);

    changeActual(0,2);
    changeActual(1,5);
    changeActual(2,5);

    // Should automatic fill out the last one.
    expect(getActual(3)).toBe(1);
});

test('Autofill first one', () => {

    expect(getActual(0)).toBe(-1);

    changeEstimate(0,3);
    changeEstimate(1,5);
    changeEstimate(2,5);
    changeEstimate(3,2);

    changeActual(1,5);
    changeActual(2,5);
    changeActual(3,2);

    // Should automatic fill out the last one.
    expect(getActual(0)).toBe(1);
});

test('Autofill more than one (1)', () => {

    expect(getActual(0)).toBe(-1);
    expect(getActual(2)).toBe(-1);
    expect(getActual(3)).toBe(-1);

    changeEstimate(0,3);
    changeEstimate(1,13);
    changeEstimate(2,5);
    changeEstimate(3,2);

    changeActual(1,13);

    // Should automatic fill out the last one.
    expect(getActual(0)).toBe(0);
    expect(getActual(2)).toBe(0);
    expect(getActual(3)).toBe(0);
});

test('Autofill more than one (2)', () => {

    expect(getActual(0)).toBe(-1);
    expect(getActual(2)).toBe(-1);

    changeEstimate(0,3);
    changeEstimate(1,6);
    changeEstimate(2,5);
    changeEstimate(3,7);

    changeActual(1,6);
    changeActual(3,7);

    // Should automatic fill out the last one.
    expect(getActual(0)).toBe(0);
    expect(getActual(2)).toBe(0);
});

test('Test that invalid actual options are not available', () => {

    expect(getActual(0)).toBe(-1);

    changeEstimate(0,3);
    changeEstimate(1,5);
    changeEstimate(2,5);
    changeEstimate(3,2);

    changeActual(1,5);
    changeActual(2,5);
    changeActual(3,2);

    for (let i = 0 ; i < 13 ; i++ ){
        if (i !== 1) {
            expect(hasSelectActualOption(0,i)).toBe(false);
        }
    }
});

test('Test that invalid actual options are not available (2)', () => {

    changeEstimate(0,3);
    changeEstimate(1,5);
    changeEstimate(2,5);
    changeEstimate(3,2);

    changeActual(1,5);
    changeActual(2,5);

    testActualRange(0,0,3);

});

test('Test that invalid actual options are not available (3)', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,3);
    changeEstimate(3,3);

    changeActual(0,3);
    changeActual(1,3);
    changeActual(2,3);

    expect(hasSelectActualOption(3,4)).toBe(true);

});

test('Test that invalid actual options are not available (4)', () => {

    changeEstimate(0,3);
    changeEstimate(1,7);
    changeEstimate(2,3);
    changeEstimate(3,3);

    changeActual(0,3);
    changeActual(1,7);

    testActualRange(2,0,3);
});

// thumbs
test('Autofill when clicking thumbs', () => {

    expect(getActual(0)).toBe(-1);

    changeEstimate(0,3);
    changeEstimate(1,6);
    changeEstimate(2,5);
    changeEstimate(3,7);

    // extract to util
    clickThumbsAt(0);

    // Should automatic fill out the last one.
    expect(getActual(0)).toBe(3);
});


test('Autofill disapears when exceeding total', () => {

    expect(getActual(0)).toBe(-1);

    changeEstimate(0,3);
    changeEstimate(1,6);
    changeEstimate(2,5);
    changeEstimate(3,7);

    expect(hasScoreAt(0)).toBe(false);

    changeActual(1,6);
    changeActual(3,7);

    expect(hasScoreAt(0)).toBe(true);
});

test('Autofill disapears when exceeding total (2)', () => {

    changeEstimate(0,3);
    changeEstimate(1,9);
    changeEstimate(2,3);
    changeEstimate(3,3);

    changeActual(0,3);
    expect(hasThumbsAt(2)).toBe(true);
    expect(hasThumbsAt(3)).toBe(true);
    changeActual(1,9);

    expect(hasThumbsAt(2)).toBe(false);
    expect(hasThumbsAt(3)).toBe(false);
});

test('Autofill disapears when not everyone have estimated', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,3);
    changeEstimate(3,-1);

    expect(hasThumbsAt(0)).toBe(false);
    expect(hasThumbsAt(1)).toBe(false);
    expect(hasThumbsAt(2)).toBe(false);
    expect(hasThumbsAt(3)).toBe(false);
});

test('Autofill disapears when all have actuals', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,3);
    changeEstimate(3,3);

    changeActual(0,3);
    changeActual(1,3);
    changeActual(2,3);
    changeActual(3,4);

    expect(hasThumbsAt(0)).toBe(false);
    expect(hasThumbsAt(1)).toBe(false);
    expect(hasThumbsAt(2)).toBe(false);
    expect(hasThumbsAt(3)).toBe(false);
});

test('Autofill disapears when actual is specified', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,3);
    changeEstimate(3,3);

    changeActual(0,3);

    expect(hasThumbsAt(0)).toBe(false);
    expect(hasThumbsAt(1)).toBe(true);
    expect(hasThumbsAt(2)).toBe(true);
    expect(hasThumbsAt(3)).toBe(true);
});

// Manual reset (estimate)

test('When estimate is reset, thumbs disapear', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,3);
    changeEstimate(3,3);

    // Verify that all have thumbs
    for (let i = 0 ; i < playerCount ; i++) {
        expect(hasThumbsAt(i)).toBe(true);
    }

    // Rest estimate
    changeEstimate(0,-1);

    // Verify thumbs have been removed again
    for (let i = 0 ; i < playerCount ; i++) {
        expect(hasThumbsAt(i)).toBe(false);
    }
});

test('When estimate is reset, still not possible to estimate remaining', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,3);

    expect(hasSelectEstimateOption(3,4)).toBe(false);

    changeEstimate(3,3);
    changeEstimate(3,-1);

    expect(hasSelectEstimateOption(3,4)).toBe(false);
});

// Manual reset (actual)

test('When restting actual, all actuals should be reset', () => {

    changeEstimate(0,3);
    changeEstimate(1,3);
    changeEstimate(2,5);
    changeEstimate(3,3);

    changeActual(0,3);
    changeActual(1,3);
    changeActual(2,5);
    changeActual(3,2);

    changeActual(0,-1);

    for (let i = 0 ; i < playerCount ; i++ ) {
        expect(getActual(i)).toEqual(-1);
    }
});

test('When choosing actual it, should only show valid options', () => {

    let actual = 3;
    changeEstimate(0,actual);
    changeEstimate(1,3);
    changeEstimate(2,5);
    changeEstimate(3,3);

    changeActual(0,actual);

    // Verify that the invalid values (exceeding round number) are not available.
    for (let i = 0 ; i < playerCount ; i++) {
        for (let j = 13 - (actual - 1)  ; j < 13 ; j++ ) {
            expect(hasSelectActualOption(i,j)).toBe(false);
        }
    }
});


function hasScoreAt(playerId) {
    return board.find(".round-score").at(playerId).hasClass("pop");
}

function hasThumbsAt(playerId) {
    return !board.find(".thumbs").at(playerId).hasClass("hide");
}

function getThumbsAt(playerId) {
    return board.find(".thumbs").at(playerId).node;
}

function clickThumbsAt(playerId) {
    const thumbs = getThumbsAt(playerId);
    if (!thumbs) {
        throw Error("No thumbs found for player id [" +  playerId + "]");
    }
    board.find(".thumbs").at(playerId).simulate("click");
}

function getActual(playerId) {
    return getValue(playerId,"actual");
}

function getEstimate(playerId) {
    return getValue(playerId,"estimate");
}

function getValue(playerId,type) {
    return board.find(`.select-${type}`).at(playerId).props().value;
}

// Return wheter the value exists in options or not
function hasSelectEstimateOption(playerId, estimate) {
    return hasSelectOption(playerId, estimate, "estimate");
}

function hasSelectActualOption(playerId, actual) {
    return hasSelectOption(playerId, actual, "actual");
}

function hasSelectOption(playerId, value, type) {
    let options = board.find(`.select-${type}`).at(playerId).props().children;
    let option = options.filter(option => { return option.props.value === value });
    return option.length > 0;
}

// Change estimate and actual in the DOM

function changeEstimate(playerId, value) {
    changeValue(playerId,value,"estimate");
}

function changeActual(playerId, value) {
    changeValue(playerId,value,"actual");
}

function changeValue(playerId, value, type) {
    board.find(`.select-${type}`).at(playerId).simulate('change',{target: { value }});
}

// Change estimate and actual in state object

function setEstimate(roundId, playerId, estimate) {
    setValue(roundId,playerId,"estimate",estimate);
}

function setActual(roundId, playerId, actual) {
    setValue(roundId,playerId,"actual",actual);
}

function setValue(roundId, playerId, type, value) {
    boardState.rows[boardState.rounds[roundId].id][playerId][type] = value;
}

function getBoardState() {
    return Object.assign({},boardState);
}

function testActualRange(playerId, min, max) {
    for (let i = min ; i < max + 1 ; i++ ) {
        expect(hasSelectActualOption(playerId,i)).toBe(true);
    }
    expect(hasSelectActualOption(playerId,max+1)).toBe(false);
}
