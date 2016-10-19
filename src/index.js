import React from 'react';
import ReactDOM from 'react-dom';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import reducer from './reducer';
import * as C from './constants';

import App from './App';
import './index.css';

const store = createStore(reducer, applyMiddleware(createLogger()));

let tid = null;

store.subscribe(() => {

  const {running} = store.getState();
  if (running && !tid) {
    tid = setInterval(() => {
      store.dispatch({ type: C.TSNE_STEP });
    }, 33);
  } else if (!running && tid) {
    clearInterval(tid);
    tid = null;
  }
});

store.dispatch({ type : C.GEN_DATA });

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);


ReactDOM.render(
  app,
  document.getElementById('root')
);
