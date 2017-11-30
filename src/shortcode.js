import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import SpeedTest from './components/Pages/SpeedTest';
import '../styles/index.scss';

import store/*, {engine}*/ from './store';

document.addEventListener('DOMContentLoaded', function() {
  const shortcode_containers = document.querySelectorAll('.webpage-speed-test');

  for (let i = 0; i < shortcode_containers.length; ++i) {
    const objectId = shortcode_containers[i].getAttribute('data-object-id');

    console.log(shortcode_containers[i]);

    ReactDOM.render(<Provider store={store}>
      <SpeedTest wpObject={window[objectId]}/>
    </Provider>, shortcode_containers[i]);
  }
});
