/* eslint-env: node */
import WebSocket from 'ws';
import { newConnection, broadcast } from './sessions.mjs';
import reducer from '../reducers/index.mjs';
import createStore from './liteStore.mjs';
import actions from '../actions/index.mjs';

const port = process.env.PORT || 8080;
const store = createStore(reducer);
store.dispatch(actions.board.load([
  [[0, 0], [500, 0], [500, 500], [0, 500], [0, 0]],
  [[150, 150], [350, 350]],
]));

let now = Date.now();
setInterval(() => {
  const future = Date.now();
  const action = actions.time(future - now);
  store.dispatch(action);
  broadcast(action);
  now = future;
}, 10);

const server = new WebSocket.Server({ port });
console.log(`Server listening on port ${port}...`);
server.on('connection', newConnection(store));
