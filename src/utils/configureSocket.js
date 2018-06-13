import commands from './socketCommands.mjs';
// import { dumpActionQueue } from './socketActionReporter';

let actionQueue = [];

export default function configureSocket(socket, store) {
  socket.addEventListener('open', () => {
    // console.log('Socket connected...');
  });

  socket.addEventListener('message', (event) => {
    const { type, data } = JSON.parse(event.data);
    // console.log({ event: event.data, type, data });
    if (type === commands.INIT) {
      // console.log('actions available', actions);
      store.dispatch({ ...data, incoming: true });
      // console.log('Initialized:', data);
    } else if (type === commands.ACTION) {
      // console.log('received action:', data);
      actionQueue.push({ ...data, incoming: true });
    }
  });

  window.onbeforeunload = () => {
    socket.close();
  };

  // return a function that flushes the read head
  return () => {
    actionQueue.forEach((action) => {
      store.dispatch(action);
    });
    actionQueue = [];
  };
}
