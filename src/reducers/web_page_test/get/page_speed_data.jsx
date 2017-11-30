import {WPT_GET_PAGE_SPEED_DATA} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_PAGE_SPEED_DATA) {
        return action.payload;
    }
    return state;
}
