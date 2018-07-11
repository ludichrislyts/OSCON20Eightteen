/* eslint-env mocha */
const chai = chai ? chai : require('chai');
const { expect } = chai;

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Player, select } from './Player.js';
import reducer from '../../reducers/index.mjs';
import actions from '../../actions/index.mjs';

describe('Player', () => {
  describe('component', () => {
    let node;
    beforeEach(() => {
      node = document.createElement('div');
    });

    afterEach(() => {
      unmountComponentAtNode(node);
    });

    it('works', () => {
      render(<Player name="bob" x={50} y={50} path={[]} angle={0} timeToStart={3} status="STARTING" />, node);
    });
  });

  describe('selector', () => {
    it('gets the player', () => {
      let state = reducer();
      state = reducer(state, actions.player.add('bob', 50, 50));
      expect(select(state, { name: 'bob' })).to.deep.equal({
        angle: 0,
        color: 'yellow',
        path: [],
        status: 'STARTING',
        timeToStart: 3,
        x: 50,
        y: 50,
      });
    });
  });
});
