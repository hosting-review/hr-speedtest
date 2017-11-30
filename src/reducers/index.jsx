import {combineReducers} from 'redux';
import * as storage from 'redux-storage';

import wptLocations from './web_page_test/get/locations.jsx';
import wptRunTestResponse from './web_page_test/run/test.jsx';
import wptTestStatus from './web_page_test/get/test_status.jsx';
import testers from './web_page_test/get/testers.jsx';
import isCanceled from './web_page_test/cancel/test.jsx';
import recentTests from './hr/get/recent';

export default storage.reducer(combineReducers({
  wptLocations,
  wptTestStatus,
  testers,
  isCanceled,
  wptRunTestResponse,
  recentTests,
}));
