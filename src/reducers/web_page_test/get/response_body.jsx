import {WPT_GET_RESPONSE_BODY} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_RESPONSE_BODY) {
        return action.payload;
    }
    return state;
}
