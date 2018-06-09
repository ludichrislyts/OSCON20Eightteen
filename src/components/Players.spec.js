
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Players, select } from './Players';
import reducer from '../reducers';
import actions from '../actions';

describe('Players', () => {
  describe('component', () => {
    let node;
    beforeEach(() => {
      node = document.createElement('div');
    });

    afterEach(() => {
      unmountComponentAtNode(node);
    });

    it('works', () => {
      render(<Players names={[]} />, node);
    });
  });

  describe('selector', () => {
    it('gets the players', () => {
      let state = reducer();
      expect(select(state).names).toEqual([]);
      state = reducer(state, actions.player.add('bob', 50, 50));
      expect(select(state).names).toEqual(['bob']);
    });
  });
});
