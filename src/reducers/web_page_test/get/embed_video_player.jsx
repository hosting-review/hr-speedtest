import {WPT_GET_EMBED_VIDEO_PLAYER} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_EMBED_VIDEO_PLAYER) {
        return action.payload;
    }
    return state;
}
