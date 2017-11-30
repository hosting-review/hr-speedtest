import {WPT_GET_CHROME_TRACE_DATA} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_CHROME_TRACE_DATA) {
        return action.payload;
    }
    return state;
}
