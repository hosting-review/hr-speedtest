import {WPT_GET_GOOGLE_CSI_DATA} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_GOOGLE_CSI_DATA) {
        return action.payload;
    }
    return state;
}
