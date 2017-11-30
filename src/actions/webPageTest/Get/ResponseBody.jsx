import wpt from '../../../wptPublic';

export const WPT_GET_RESPONSE_BODY = 'WPT_GET_RESPONSE_BODY';

export function wptGetResponseBody(options) {
    return function (dispatch) {
        wpt.getResponseBody(options.id, (error, response) => {
            dispatch({
                type: WPT_GET_RESPONSE_BODY,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
