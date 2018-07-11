/* eslint-env mocha */
const chai = chai ? chai : require('chai');
const { expect } = chai;

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Polyline from './Polyline.js';

describe('Polyline', () => {
  let node;
  beforeEach(() => {
    node = document.createElement('svg');
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  const make = (child) => {
    render(child, node);
    return node.firstChild;
  };

  it('renders without crashing', () => {
    render(<Polyline />, node);
    expect(node.innerHTML).to.equal('');
  });

  it('renders attributes downward', () => {
    const subject = make(<Polyline points={[[0, 0], [5, 5]]} fill="#333" />);
    expect(subject.getAttribute('fill')).to.equal('#333');
  });

  it('renders a line as expected', () => {
    const points = [[0, 0], [100, 100]];
    const subject = make(<Polyline points={points} />);
    expect(subject.getAttribute('d')).to.equal('M0 0L100 100');
  });
});
