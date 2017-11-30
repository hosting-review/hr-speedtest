import wpt from '../../../wptPublic';

export const WPT_GET_REQUEST_DATA = 'WPT_GET_REQUEST_DATA';

export function wptGetRequestData(options) {
    return function (dispatch) {
        wpt.getRequestData(options.id, (error, response) => {
            dispatch({
                type: WPT_GET_REQUEST_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
