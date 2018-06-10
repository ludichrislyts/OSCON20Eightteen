/* eslint-env: node */
const WebSocket = require('ws');
const sessions = require('./sessions');
const reducer = require('../reducers/index');
const { createStore } = require('redux');

const port = process.env.PORT || 8080;
const store = createStore(reducer);

const server = new WebSocket.Server({ port });
console.log(`Server listening on port ${port}...`);
server.on('connection', sessions.newConnection(store));
