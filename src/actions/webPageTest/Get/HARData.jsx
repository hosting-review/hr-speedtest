import wpt from '../../../wptPublic';

export const WPT_GET_HAR_DATA = 'WPT_GET_HAR_DATA';

export function wptGetHARData(options) {
    return function (dispatch) {
        wpt.getLocations(options.id, function (error, response) {
            dispatch({
                type: WPT_GET_HAR_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
