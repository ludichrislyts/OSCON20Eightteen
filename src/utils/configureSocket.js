import commands from './socketCommands.mjs';
import { actions } from './constants.mjs';
// import { dumpActionQueue } from './socketActionReporter';

let actionQueue = [];

export default function configureSocket(socket, store) {
  socket.addEventListener('open', () => {
    console.log('Socket connected...');
  });

  socket.addEventListener('message', event => {
    const { type, data } = JSON.parse(event.data);
    console.log({ event: event.data, type, data });
    if (type === commands.INIT) {
      store.dispatch({ type: actions.SET_STATE, data, incoming: true });
      console.log('Initialized:', data);
    } else if (type === commands.ACTION) {
      console.log('received action:', data);
      actionQueue.push({ ...data, incoming: true });
    }
  });

  window.onbeforeunload = () => {
    socket.close();
  };

  // return a function that flushes the read head
  return () => {
    actionQueue.forEach(action => {
      store.dispatch(action);
    });
    actionQueue = [];
  };
}
