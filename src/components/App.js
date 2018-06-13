import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Board from './Board';
import Players from './Players';
import PlayerStart from './PlayerStart';

export const App = ({
  minX = 0, minY = 0, width = 100, height = 100, // isPlaying, x, y,
}) => (
  <div>
    <svg
      width="100%"
      viewBox={`${minX} ${minY} ${width} ${height}`}
      // style={isPlaying ? { transform: `matrix(1, 0, 0, 1, ${width / 2 - x}, ${height / 2 - y})` } : null}
    >
      <Board />
      <Players />
    </svg>
    <PlayerStart />
  </div>
);

App.propTypes = {
  minY: PropTypes.number,
  minX: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

export const select = (state) => {
  const {
    minX, minY, maxX, maxY, currentPlayer,
  } = state;
  const player = state.players[currentPlayer];
  const { x, y } = player || { x: 0, y: 0 };
  const isPlaying = player && player.status !== 'CRASHED';
  return {
    minX, minY, width: maxX - minX, height: maxY - minY, x, y, isPlaying,
  };
};

export default connect(select)(App);
