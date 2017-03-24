import React from 'react';
import {mount} from 'enzyme';
import {GameMenu} from '../../src/Game-menu';


const maxPlayerCount = 4;
const minPlayerCount = 2;
const previousPos = 0;
const nextPos = 1;
let gameMenu;


test('Intial shows the default player count', () => {
	gameMenu = mount(<GameMenu/>);

    expect(getPlayerCount()).toBe(maxPlayerCount);
});


test('Decrease should remove a player', () => {
	gameMenu = mount(<GameMenu/>);

	gameMenu.find("button").at(previousPos).simulate("click");

    expect(getPlayerCount()).toBe(maxPlayerCount-1);
});

test('Decrease should not go below min player count', () => {
	gameMenu = mount(<GameMenu/>);

	for (let i = 0 ; i < maxPlayerCount - minPlayerCount ; i++) {
		gameMenu.find("button").at(previousPos).simulate("click");
	}

    expect(getPlayerCount()).toBe(minPlayerCount);
    expect(isDisabled(previousPos)).toBe(true);
});

test('Increase should not go above max player count', () => {
	gameMenu = mount(<GameMenu/>);

    expect(isDisabled(nextPos)).toBe(true);
});


/* Helper */

const getPlayerCount = () => {
	let count = 0;
	for (let i = 0 ; i < maxPlayerCount ; i++) {
		if (!gameMenu.find("input[type='text']").at(i).props().disabled) {
			count++;
		}
	}
	return count;
}

const isDisabled = (pos) => {
	return gameMenu.find("button").at(pos).props().disabled;
}
