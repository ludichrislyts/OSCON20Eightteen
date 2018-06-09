import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import Polyline from './Polyline';
import { directions } from '../utils/constants';
import './Player.css';

const {
  UP, DOWN, LEFT, RIGHT,
} = directions;

export const Player = ({
  x, y, angle, path, timeToStart, status,
}) => (
  <g className="player" status={status}>
    <g className="player__path">
      <Polyline points={path} />
      { path.length ? <Polyline points={[[x, y], path[path.length - 1]]} /> : null }
    </g>
    <svg x={x - 15} y={y - 15} width="30" height="30" viewBox="0 0 30 30">
      <path
        className="player__arrow"
        style={{ transform: `rotate(${angle}deg)` }}
        d={`M15 ${timeToStart ? 0 : 5}l4 7h-8z`}
      />
    </svg>
    <circle cx={x} cy={y} r={timeToStart ? 7 : 3} />
    { timeToStart
      ? (<text x={x} y={y + 1} textAnchor="middle" alignmentBaseline="central">{timeToStart}</text>)
      : null
    }
  </g>
);

Player.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  timeToStart: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export const select = (state, { name }) => {
  const {
    x, y, path, direction, startTime, status,
  } = state.players[name];
  const { time } = state;
  const age = time - startTime;
  const timeToStart = age < 0 ? -Math.floor(age / 1000) : 0;
  let angle;
  switch (direction) {
    case UP: angle = 0; break;
    case DOWN: angle = 180; break;
    case LEFT: angle = -90; break;
    case RIGHT: angle = 90; break;
    default: angle = 0;
  }
  return {
    x, y, path, timeToStart, status, angle,
  };
};

export default connect(select)(Player);
