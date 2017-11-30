import {WPT_GET_NET_LOG_DATA} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_NET_LOG_DATA) {
        return action.payload;
    }
    return state;
}
