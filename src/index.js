import './index.css';
import registerServiceWorker from './registerServiceWorker';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './components/App';
import reducer from './reducers/index.mjs';
import actions from './actions';
import { keyCodes, playerStates } from './utils/constants.mjs';
import currentPlayerDirection from './subscribers/currentPlayerDirection';
import currentPlayerStatus from './subscribers/currentPlayerStatus';
import configureSocket from './utils/configureSocket';
import socketActionMiddleware from './utils/socketActionReporter';

const socket = new WebSocket('ws://localhost:8080');

const {
  board, player: {
    up, down, left, right,
  },
} = actions;
const {
  UP, DOWN, LEFT, RIGHT,
} = keyCodes;

const store = createStore(
  reducer, reducer(), applyMiddleware(socketActionMiddleware(socket)),
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const readSocket = configureSocket(socket, store);

store.dispatch(board.load([
  [[0, 0], [500, 0], [500, 500], [0, 500], [0, 0]],
  [[150, 150], [350, 350]],
]));

// TODO: add middleware to intercept dispatches and send to socket instead
// TODO: append 'incoming' or something to actions from the server so the middleware skips them

document.addEventListener('keydown', evt => {
  const { currentPlayer: name, players } = store.getState();
  if (!name) return;
  const player = players[name];
  if (!player || player.status === playerStates.CRASHED) return;
  switch (evt.keyCode) {
    case UP: store.dispatch(up(name)); break;
    case DOWN: store.dispatch(down(name)); break;
    case LEFT: store.dispatch(left(name)); break;
    case RIGHT: store.dispatch(right(name)); break;
    default: // do nothing
  }
});

// sound effect hooks
currentPlayerDirection(store);
currentPlayerStatus(store);

let last;
const step = current => {
  if (last) {
    // play all actions we have recieved from the socket
    readSocket();
  }
  last = current;
  requestAnimationFrame(step);
};
requestAnimationFrame(step);

render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
