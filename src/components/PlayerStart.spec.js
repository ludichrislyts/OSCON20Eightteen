
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { PlayerStart, select, dispatchers } from './PlayerStart';
import reducer from '../reducers';
import actions from '../actions';
import { actions as actionTypes } from '../utils/constants';

const { PLAYER_ADD, PLAYER_CURRENT } = actionTypes;

describe('PlayerStart', () => {
  describe('component', () => {
    let node;
    beforeEach(() => {
      node = document.createElement('div');
    });

    afterEach(() => {
      unmountComponentAtNode(node);
    });

    const make = (child) => {
      render(child, node);
      return node.firstChild;
    };

    it('shows the visible Attribute', () => {
      const subject = make(<PlayerStart visible onSubmit={x => x} />);
      expect(subject.getAttribute('visible')).toEqual('visible');
    });

    it('does not show the visible Attribute', () => {
      const subject = make(<PlayerStart onSubmit={x => x} />);
      expect(subject.getAttribute('visible')).toEqual(null);
    });
  });

  describe('selector', () => {
    it('returns visible=true when there is a current player', () => {
      let state = reducer(reducer(), actions.player.add('ian', 50, 50));
      state = reducer(state, actions.player.claim('ian'));
      expect(select(state).visible).toEqual(true);
    });
  });

  describe('dispatcher', () => {
    it('calls dispatch twice', () => {
      const dispatch = jest.fn();
      dispatchers(dispatch).joinGame('bob', 50, 50);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).nthCalledWith(1, 'beef');
      // expect(dispatch).toHaveBeenNthCalledWith(1, { type: PLAYER_CURRENT, data: 'bob' });
      // [{ type: PLAYER_ADD, data: { name: 'bob', x: 50, y: 50 } }],
    });
  });
});
