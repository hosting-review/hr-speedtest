import {WPT_CREATE_VIDEO} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_CREATE_VIDEO) {
        return action.payload;
    }
    return state;
}
