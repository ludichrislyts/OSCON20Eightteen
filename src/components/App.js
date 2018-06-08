import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Board from './Board';

export const App = ({
  minX = 0, minY = 0, width = 100, height = 100,
}) => (
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" viewBox={`${minX} ${minY} ${width} ${height}`}>
      <Board />
    </svg>
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
    minX, minY, maxX, maxY,
  } = state;
  return {
    minX, minY, width: maxX - minX, height: maxY - minY,
  };
};

export default connect(select)(App);
