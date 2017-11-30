import {WPT_GET_REQUEST_DATA} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_REQUEST_DATA) {
        return action.payload;
    }
    return state;
}
