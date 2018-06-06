import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Polyline from './Polyline';

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
    expect(node.innerHTML).toEqual('<path d=""></path>');
  });

  it('renders attributes downward', () => {
    const subject = make(<Polyline fill="#333" />);
    expect(subject.getAttribute('fill')).toEqual('#333');
  });

  it('renders a line as expected', () => {
    const points = [[0, 0], [100, 100]];
    const subject = make(<Polyline points={points} />);
    expect(subject.getAttribute('d')).toEqual('M0 0L100 100');
  });
});
