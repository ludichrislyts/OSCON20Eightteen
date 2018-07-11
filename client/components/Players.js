import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import Player from './Player';

export const Players = ({ names }) => (
  <g className="players">
    { names.map(name => <Player key={name} name={name} />)}
  </g>
);

Players.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const select = state => ({ names: Object.keys(state.players) });

export default connect(select)(Players);
