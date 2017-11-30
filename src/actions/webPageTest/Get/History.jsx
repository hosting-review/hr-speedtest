import wpt from '../../../wptPublic';

export const WPT_GET_HISTORY = 'WPT_GET_HISTORY';

export function wptGetHistory(options) {
    return function (dispatch) {
        wpt.getLocations(options.id, function (error, response) {
            dispatch({
                type: WPT_GET_HISTORY,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
