import {GET_RECENT_TESTS} from '../../../actions';

export default function (state = false, action) {
  if (action.type === GET_RECENT_TESTS) {
    return action.payload;
  }
  return state;
}
