/* eslint-env: node */
const commands = require('../utils/socketCommands');
const { actions } = require('../utils/constants');

const sessions = {};

exports.sendAction = socket => action => {
  socket.send(JSON.stringify({
    type: commands.ACTION,
    data: action,
  }));
};

exports.broadcast = action => {
  Object.keys(sessions).forEach(id => {
    const socket = sessions[id];
    try {
      exports.sendAction(socket)({
        type: commands.ACTION,
        data: action,
      });
    } catch (err) {
      console.error('ERR: Failed to send');
    }
  });
};

exports.nameAvailable = name => Object.keys(sessions).every(id => sessions[id].name !== name);

exports.newConnection = store => socket => {
  const id = Date.now();
  const sendAction = exports.sendAction(socket);
  socket.on('message', message => {
    const { type, data: action } = JSON.parse(message);
    if (type === commands.ACTION) {
      if (action.type === actions.PLAYER_ADD) {
        if (exports.nameAvailable(action.data)) {
          // eslint-disable-next-line no-param-reassign
          socket.name = action.data;
        } else {
          sendAction({
            type: actions.PLAYER_ADD_ERR,
            data: null,
          });
          return;
        }
      }

      // reduce on our local store
      store.dispatch(action);
      // broadcast to all other sessions
      exports.broadcast(action);

      if (action.type === actions.PLAYER_ADD) {
        sendAction({
          type: actions.PLAYER_CURRENT,
          data: null,
        });
      }
    }
  });

  socket.on('close', () => {
    delete sessions[id];
    exports.broadcast({
      type: actions.PLAYER_REMOVE,
      data: id,
    });
  });

  // Welcome to the party, here is the current state
  socket.send(JSON.stringify({
    type: commands.INIT,
    data: store.getState(),
  }));
};
