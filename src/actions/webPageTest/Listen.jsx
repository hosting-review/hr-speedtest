import wpt from '../../wptPublic';

export const WPT_LISTEN = 'WPT_LISTEN';

export function wptListen(options) {
    return function (dispatch) {
        wpt.listen(options.port, function (error, { response }) {
            dispatch({
                type: WPT_LISTEN,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
