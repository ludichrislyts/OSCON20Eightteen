import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import Polyline from './Polyline';

export const Player = ({
  x, y, angle, path, timeToStart, status, color,
}) => (
  <g className="player" status={status}>
    <g className="player__path">
      <Polyline points={path} stroke={color} />
      { path.length ? <Polyline points={[[x, y], path[path.length - 1]]} stroke={color} /> : null }
    </g>
    <svg x={x - 15} y={y - 15} width="30" height="30" viewBox="0 0 30 30">
      <path
        className="player__arrow"
        style={{ transform: `rotate(${angle}deg)` }}
        d={`M15 ${timeToStart ? 0 : 5}l4 7h-8z`}
        fill={color}
      />
    </svg>
    <circle cx={x} cy={y} r={timeToStart ? 7 : 3} fill={color} />
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
  color: PropTypes.string.isRequired,
};

export const select = (state, { name }) => {
  const {
    x, y, path, direction, startTime, status, color,
  } = state.players[name];
  const { time } = state;
  const age = time - startTime;
  const timeToStart = age < 0 ? -Math.floor(age / 1000) : 0;
  const [xDir, yDir] = direction;
  const angle = xDir ? (xDir * 90) : (1 + yDir) * 90;
  return {
    x, y, path, timeToStart, status, angle, color,
  };
};

export default connect(select)(Player);
