import {WPT_GET_SCREENSHOT_IMAGE} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_SCREENSHOT_IMAGE) {
        return action.payload;
    }
    return state;
}
