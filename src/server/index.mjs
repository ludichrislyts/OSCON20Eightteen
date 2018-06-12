/* eslint-env: node */
import WebSocket from 'ws';
import { newConnection } from './sessions.mjs';
import reducer from '../reducers/index.mjs';
import createStore from './liteStore.mjs';

const port = process.env.PORT || 8080;
const store = createStore(reducer);

const server = new WebSocket.Server({ port });
console.log(`Server listening on port ${port}...`);
server.on('connection', newConnection(store));
