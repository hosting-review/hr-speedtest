import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import SpeedTest from './components/Pages/SpeedTest';
import '../styles/index.scss';

import store/*, {engine}*/ from './store';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
      <Provider store={store}>
        <SpeedTest wpObject={window.wpr_object}/>
      </Provider>, document.getElementById('wp-reactivate-admin'));
});
