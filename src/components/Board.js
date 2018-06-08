/* eslint react/no-array-index-key: 0 */

import './Board.css';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import Polyline from './Polyline';

export const Board = ({ obstacles = [], ...rest }) => (
  <g className="board" {...rest}>
    { obstacles.map((poly, index) => (<Polyline key={`ob-${index}`} points={poly} />))}
  </g>
);

Board.propTypes = {
  obstacles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
};

export const select = state => ({ obstacles: state.obstacles });

const dispatchers = () => ({});

export default connect(select, dispatchers)(Board);
