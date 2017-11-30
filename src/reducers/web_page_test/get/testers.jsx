import {WPT_GET_TESTERS} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_TESTERS) {
        state = action.payload;
    }
    return state;
}
