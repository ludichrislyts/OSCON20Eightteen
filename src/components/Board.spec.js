
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Board, select } from './Board';
import reducer from '../reducers/index.mjs';
import actions from '../actions/index.mjs';

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
      expect(node.innerHTML).toEqual('<g class="board"></g>');
    });

    it('renders all the parts', () => {
      const subject = make(<Board obstacles={board} />);
      expect(subject.querySelectorAll('path')).toHaveLength(2);
    });
  });

  describe('selector', () => {
    it('gets the board', () => {
      const action = actions.board.load(board);
      const state = reducer(reducer(), action);
      expect(select(state).obstacles).toEqual(board);
    });
  });
});
