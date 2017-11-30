import {WPT_CANCEL_TEST} from "../../../actions";

export default function (state = false, action) {
    if (action.type === WPT_CANCEL_TEST) {
        state = action.payload;
    }
    return state;
}
