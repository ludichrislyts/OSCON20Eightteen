import React from 'react';
import PropTypes from 'prop-types';

const spacePoint = point => point.join(' ');
const makePath = path => (path ? `M${path.map(spacePoint).join('L')}` : '');

const Polyline = ({ points = [], ...rest }) => (
  points.length ? <path d={makePath(points)} {...rest} /> : null
);

Polyline.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

export default Polyline;
