import {WPT_GET_TEST_RESULTS} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_TEST_RESULTS) {
        return action.payload;
    }
    return state;
}
