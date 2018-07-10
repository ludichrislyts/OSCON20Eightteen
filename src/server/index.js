/* eslint-env: node */
/* eslint no-console: 0 */
const WebSocket = require('ws');
const sessions = require('./sessions');

const port = process.env.PORT || 8080;

const server = new WebSocket.Server({ port });
console.log(`Server listening on port ${port}...`);
server.on('connection', sessions.newConnection);
