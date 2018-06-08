import './index.css';
import registerServiceWorker from './registerServiceWorker';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './components/App';
import reducer from './reducers';
import actions from './actions';

const store = createStore(reducer);

store.dispatch(actions.board.load([
  [[0, 0], [500, 0], [500, 500], [0, 500], [0, 0]],
  [[150, 150], [350, 350]],
]));

render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
