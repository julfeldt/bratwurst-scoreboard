import React from 'react';
const FontAwesome = require('react-fontawesome');
import './Buttons-bar.css';
import './vendor/font-awesome.min.css';

export const ButtonsBar = (props) => {
    return (
        <footer>
          <div className="menu-button">
            <button type="button" onClick={props.newGame} onTouchEnd={props.newGame}>
              <FontAwesome name="bars" title="Nyt spil"/>
            </button>
          </div>
          <div className="round-previous menu-button">
            <button disabled={!props.showPrevious} className="button-previous" type="button" onClick={props.handlePreviousRound} onTouchEnd={props.handlePreviousRound}>
              <FontAwesome name="arrow-left" title="Forrige runde"/>
            </button>
          </div>
          <div className="round-next menu-button">
            <button disabled={!props.showNext} className="button-next" type="button" onClick={props.handleNextRound} onTouchEnd={props.handleNextRound}>
              <FontAwesome name="arrow-right" title="Næste runde"/>
            </button>
          </div>
        </footer>
    )
}
