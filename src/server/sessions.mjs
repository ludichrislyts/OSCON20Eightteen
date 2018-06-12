/* eslint-env: node */
import commands from '../utils/socketCommands.mjs';
import { actions } from '../utils/constants.mjs';

const sessions = {};

export const sendAction = socket => action => {
  socket.send(JSON.stringify({
    type: commands.ACTION,
    data: action,
  }));
};

export const broadcast = action => {
  Object.keys(sessions).forEach(id => {
    const socket = sessions[id];
    try {
      sendAction(socket)({
        type: commands.ACTION,
        data: action,
      });
    } catch (err) {
      console.error('ERR: Failed to send');
    }
  });
};

export const nameAvailable = name => Object.keys(sessions).every(id => sessions[id].name !== name);

export const newConnection = store => socket => {
  const id = Date.now();
  const send = sendAction(socket);
  socket.on('message', message => {
    const { type, data: action } = JSON.parse(message);
    if (type === commands.ACTION) {
      if (action.type === actions.PLAYER_ADD) {
        if (nameAvailable(action.data)) {
          // eslint-disable-next-line no-param-reassign
          socket.name = action.data;
        } else {
          send({
            type: actions.PLAYER_ADD_ERR,
            data: null,
          });
          return;
        }
      }

      // reduce on our local store
      store.dispatch(action);
      // broadcast to all other sessions
      broadcast(action);

      if (action.type === actions.PLAYER_ADD) {
        send({
          type: actions.PLAYER_CURRENT,
          data: null,
        });
      }
    }
  });

  socket.on('close', () => {
    delete sessions[id];
    broadcast({
      type: actions.PLAYER_DISCONNECT,
      data: id,
    });
  });

  // Welcome to the party, here is the current state
  socket.send(JSON.stringify({
    type: commands.INIT,
    data: store.getState(),
  }));
};
