import {WPT_GET_UTILIZATION_DATA} from "../../../actions";

export default function (state = [], action) {
    if (action.type === WPT_GET_UTILIZATION_DATA) {
        return action.payload;
    }
    return state;
}
