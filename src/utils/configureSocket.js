/* eslint no-console: 0 */
import commands from './socketCommands';
// import { dumpActionQueue } from './socketActionReporter';

export default function configureSocket(socket, store) {
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      type: commands.INIT,
      data: 'Ma name!',
    }));
  });

  socket.addEventListener('message', (event) => {
    const { type, data } = JSON.parse(event.data);
    if (type === commands.INIT) {
      console.log('Initialized:', data);
    } else if (type === commands.ACTION) {
      console.log(data);
      store.dispatch(data);
    }
  });

  // socket.on(commands.READY, () => {
  //   dumpActionQueue(socket);
  // });

  window.onbeforeunload = () => {
    socket.close();
  };
}
