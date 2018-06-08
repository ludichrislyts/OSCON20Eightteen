import './PlayerStart.css';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import actions from '../actions';
import { pointIsInPolygon } from '../utils/calc';

export const PlayerStart = ({ visible = false, onSubmit }) => {
  const textInput = React.createRef();
  const submit = (evt) => {
    evt.preventDefault();
    onSubmit(textInput.value);
  };
  return (
    <form className="player-start" visible={visible ? 'visible' : null} onSubmit={submit}>
      <input ref={textInput} type="text" />
      <button type="submit">Start</button>
    </form>
  );
};

PlayerStart.propTypes = {
  visible: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export const select = (state) => {
  const {
    currentPlayer, obstacles, minX, maxX, minY, maxY,
  } = state;
  return {
    visible: currentPlayer != null,
    perimeter: obstacles[0],
    minX,
    maxX,
    minY,
    maxY,
  };
};

export const dispatchers = dispatch => ({
  joinGame: (name, x, y) => {
    dispatch(actions.player.add(name, x, y));
    dispatch(actions.player.claim(name));
  },
});

const findPointInside = (perimeter, minX, maxX, minY, maxY) => {
  let tries = 0;
  while (tries < 100) {
    tries += 1;
    const point = [
      (Math.random() * (maxX - minX)) + minX,
      (Math.random() * (maxY - minY)) + minY,
    ];
    if (pointIsInPolygon(point, perimeter)) return point;
  }
  throw Error('failed to find a starting point for a new player. Maybe your board doesn\'t have enough area?');
};

export const mergeProps = ({
  visible, perimeter, minX, maxX, minY, maxY,
}, { joinGame }) => ({
  visible,
  onSubmit: name => joinGame(name, ...(findPointInside(perimeter, minX, maxX, minY, maxY))),
});

export default connect(select, dispatchers)(PlayerStart);
