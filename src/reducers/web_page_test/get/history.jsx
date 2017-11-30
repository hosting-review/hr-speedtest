import {WPT_GET_HISTORY} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_HISTORY) {
        return action.payload;
    }
    return state;
}
