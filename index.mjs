/* eslint-env: node */
/* eslint no-console: 0 */
import path from 'path';
import WebSocket from 'ws';
import { newConnection, broadcast } from './server/sessions.mjs';
import reducer from './reducers/index.mjs';
import createStore from './server/liteStore.mjs';
import actions from './actions/index.mjs';

// Socket server //////////////

const socketPort = process.env.SOCKET_PORT || 8081;
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

const server = new WebSocket.Server({ port: socketPort });
console.log(`Socket server listening on port ${socketPort}...`);
server.on('connection', newConnection(store));


// File server //////////////

import express from 'express';
import http from 'http';

const app = express();
app.server = http.createServer(app);

const port = process.env.PORT || 8080;
app.server.listen(port, () => {
  console.log(`Web server listening on port ${app.server.address().port}...`);
});

app.get('*.m?js', express.static('.'));
app.use('/test', express.static('test'));
app.use('/', express.static('dist'));