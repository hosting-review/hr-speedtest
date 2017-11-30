import {WPT_LISTEN} from "../../actions";

export default function (state = [], action) {
    if (action.type === WPT_LISTEN) {
        return action.payload;
    }
    return state;
}
