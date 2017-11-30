import {WPT_SCRIPT_TO_STRING} from "../../actions";

export default function (state = [], action) {
    if (action.type === WPT_SCRIPT_TO_STRING) {
        return action.payload;
    }
    return state;
}
