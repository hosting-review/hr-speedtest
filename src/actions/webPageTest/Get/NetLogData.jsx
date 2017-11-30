import wpt from '../../../wptPublic';

export const WPT_GET_NET_LOG_DATA = 'WPT_GET_NET_LOG_DATA';

export function wptGetNetLogData(params) {
    return function (dispatch) {
        wpt.getNetLogData(params.id, (error, response) => {
            dispatch({
                type: WPT_GET_NET_LOG_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
