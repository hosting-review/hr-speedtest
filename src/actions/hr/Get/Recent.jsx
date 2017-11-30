import axios from 'axios';

export const GET_RECENT_TESTS = 'GET_RECENT_TESTS';

export function getRecentTests(property, url) {
  return function (dispatch) {
    axios.get(url + '?' + (Math.floor(Math.random() * (99999999999 - 10000000000)) + 1000000000)).then(response => {
      dispatch({
        type: GET_RECENT_TESTS,
        payload: response.data.recent
      });
    });
  }
}
