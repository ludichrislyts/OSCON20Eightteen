import commands from './socketCommands';
import { actions } from './constants';
import { board } from '../actions/index';
// import { dumpActionQueue } from './socketActionReporter';

const actionQueue = [];

export default function configureSocket(socket, store) {
  socket.addEventListener('open', () => {
    console.log('Socket connected...');
  });

  socket.addEventListener('message', event => {
    const { type, data } = JSON.parse(event.data);
    if (type === commands.INIT) {
      store.dispatch({ type: actions.SET_STATE, data });
      console.log('Initialized:', action);
    } else if (type === commands.ACTION) {
      actionQueue.push(data);
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
