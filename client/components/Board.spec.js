/* eslint-env mocha */
const chai = chai ? chai : require('chai');
const { expect } = chai;

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Board, select } from './Board.js';
import reducer from '../../reducers/index.mjs';
import actions from '../../actions/index.mjs';

describe('Board', () => {
  const board = [
    [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
    [[20, 20], [80, 80]],
  ];

  describe('component', () => {
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
      render(<Board />, node);
      expect(node.innerHTML).to.equal('<g class="board"></g>');
    });

    it('renders all the parts', () => {
      const subject = make(<Board obstacles={board} />);
      expect(subject.querySelectorAll('path').length).to.equal(2);
    });
  });

  describe('selector', () => {
    it('gets the board', () => {
      const action = actions.board.load(board);
      const state = reducer(reducer(), action);
      expect(select(state).obstacles).to.deep.equal(board);
    });
  });
});
