/* eslint react/no-array-index-key: 0 */

import './Board.css';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import Polyline from './Polyline';

export const Component = ({ obstacles = [], ...rest }) => (
  <g className="board" {...rest}>
    { obstacles.map((poly, index) => (<Polyline key={`ob-${index}`} points={poly} />))}
  </g>
);

Component.propTypes = {
  obstacles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
};

export const select = state => state.obstacles;

export default connect(select)(Component);
