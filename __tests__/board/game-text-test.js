import React from 'react';
import * as Fixture from "../fixtures";
import {GameText} from '../../src/game-text';
import {mount} from 'enzyme';

let { seq,players,rounds,rows } = Fixture;
let row = rows[rounds[1].id];

test('All have estimated over, but no actuals', () => {
    prepareRow(row,[3,3,3,7],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual("Runden går 3 stik over");
});

test('All have estimated under, but no actuals', () => {
    prepareRow(row,[3,3,3,3],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual("Runden går 1 stik under");
});

test('Not all have estimated', () => {
    prepareRow(row,[3,-1,-1,-1],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual("10 af 13 stik tilbage");
});

test('Not all have estimated (2)', () => {
    prepareRow(row,[3,3,-1,-1],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual("7 af 13 stik tilbage");
});

test('Estimates exceed available sets', () => {
    prepareRow(row,[13,3,-1,-1],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual("Ingen stik tilbage");
});

test('All estimated except one player', () => {
    prepareRow(row,[3,3,5,-1],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual(`${players[3]} må ikke estimere 2 stik`);
});

test('All estimated except one player (2)', () => {
    prepareRow(row,[3,-1,0,4],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual(`${players[1]} må ikke estimere 6 stik`);
});

test('All estimated except one player, but exceeds the possible sets', () => {
    prepareRow(row,[3,-1,7,4],[-1,-1,-1,-1]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual(`${players[1]} må estimerer frit`);
});

test('Single winner', () => {
    prepareRow(row,[3,3,3,5],[3,3,2,5]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual(`${players[3]} vinder runden med 35 point`);
});

test('Multiple winners', () => {
    prepareRow(row,[3,3,3,5],[3,3,3,4]);

    let gameText = renderGameText(seq,players,rounds,rows);

    expect(gameText.text()).toEqual(`${players[0]},${players[1]} og ${players[2]} vinder runden med 19 point`);
});

const renderGameText = (seq,players,rounds,rows) => {
    return mount(<GameText players={players} seq={seq} rounds={rounds} rows={rows} />);
}

const prepareRow = (row, estimates, actuals) => {
    for (let i = 0 ; i < estimates.length ; i++) {
        row[i].estimate = estimates[i];
        row[i].actual = actuals[i];
    }
}
