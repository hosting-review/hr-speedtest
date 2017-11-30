import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store/*, {engine}*/ from './store';

import SpeedTest from './components/Pages/SpeedTest';
import '../styles/index.scss';

document.addEventListener('DOMContentLoaded', function() {
  const widget_containers = document.querySelectorAll('.wp-reactivate-widget');

  for (let i = 0; i < widget_containers.length; ++i) {
    const objectId = widget_containers[i].getAttribute('data-object-id');

    ReactDOM.render(<Provider store={store}>
      <SpeedTest wpObject={window[objectId]}/>
    </Provider>, widget_containers[i]);
  }
});