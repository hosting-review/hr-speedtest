import {WPT_GET_TEST_INFO} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_TEST_INFO) {
        return action.payload;
    }
    return state;
}
