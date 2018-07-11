/* eslint-env mocha */
const chai = chai ? chai : require('chai');
const { expect } = chai;

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Players, select } from './Players.js';
import reducer from '../../reducers/index.mjs';
import actions from '../../actions/index.mjs';

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
      expect(select(state).names).to.deep.equal([]);
      state = reducer(state, actions.player.add('bob', 50, 50));
      expect(select(state).names).to.deep.equal(['bob']);
    });
  });
});
