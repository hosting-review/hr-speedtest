import {WPT_GET_LOCATIONS} from '../../../actions';

export default function(state = {}, action) {
  if (action.type === WPT_GET_LOCATIONS) {
    return action.payload;
  }
  return state;
}
