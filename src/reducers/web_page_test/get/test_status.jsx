import {WPT_GET_TEST_STATUS} from "../../../actions";

export default function (state = {}, action) {
    if (action.type === WPT_GET_TEST_STATUS) {
        return action.payload;
    }
    return state;
}
