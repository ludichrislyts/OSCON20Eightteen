import { actions as actionTypes } from './constants.mjs';
import commands from './socketCommands.mjs';

let ready = false;
const queue = [];

const handleAction = (action, socket) => {
  console.log('sending action to server:', action);
  socket.emit(commands.ACTION, action);
};

export const dumpActionQueue = socket => {
  ready = true;
  queue.forEach(queuedAction => {
    handleAction(queuedAction, socket);
  });
  queue.length = 0;
};

/**
 * This middleware reports all actions to the server on a socket.
 * Any pending actions are renamed so the server can handle them appropriately.
 * Also, some actions will require data to be retrieved from the server, so
 * these will get follow-up requests for data
 *
 * @param {Object} socket The socket.io socket to use for all actions.
 * @return {Function} A middleware function to use with a Redux store
 */
const socketActionReporter = socket => store => next => action => {
  // don't cycle incoming actions back - these are from the server
  if (action.incoming) return next(action);

  // Create any extra needed actions and send them out
  const actions = [action];
  switch (action.type) {
    // this means that we got state from the server and we can dump our queue
    case actionTypes.SET_STATE: {
      next(action);
      dumpActionQueue();
      break;
    }

    // These would be actions that don't need to go to the server first
    // case actionTypes.STUFF: {
    //   next(action);
    //   break;
    // }

    default:
      // do nothing
      break;
  }

  // outgoing
  actions.forEach(act => {
    if (!ready) queue.push(act);
    else handleAction(act, socket, store);
  });

  // by default, we don't allow actions to hit the reducer - they need to come from the server
  return null; // next(action);
};

export default socketActionReporter;
