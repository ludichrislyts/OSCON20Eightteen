/* eslint-env: node */
/* eslint no-console: 0 */
const commands = require('../utils/socketCommands');
const pacemaker = require('./pacemaker');

const sessions = {};
let queue = [];

exports.newConnection = (socket) => {
  let id = null;
  socket.on('message', (message) => {
    const { type, data } = JSON.parse(message);
    if (type === commands.INIT) {
      id = data;
      sessions[id] = socket;
      console.log('Initialized:', id);
      // this call is item potent
      pacemaker.subscribe(exports.handleTick);
    } else if (type === commands.ACTION) {
      if (!id) return;
      queue.push({ id, ...data });
    }
  });

  socket.on('close', () => {
    if (!id) return;
    delete sessions[id];
    queue.push({ id, type: commands.CLOSE, data: null });
  });

  socket.send(JSON.stringify({
    type: commands.INIT,
    data: { success: true },
  }));
};

exports.handleTick = (time) => {
  queue.push({ type: commands.ACTION, data: { type: 'TICK', data: time } });
  const players = Object.keys(sessions);
  console.log({ queue, players });
  if (!players.length) {
    pacemaker.unsubscribe(exports.handleTick);
    queue = [];
    return;
  }

  players.forEach((id) => {
    const socket = sessions[id];
    try {
      socket.send(...queue.map(JSON.stringify));
    } catch (err) {
      console.error('ERR: Failed to send');
    }
  });
  queue = [];
};
