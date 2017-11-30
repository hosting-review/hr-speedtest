import wpt from '../../../wptPublic';

export const WPT_GET_CHROME_TRACE_DATA = 'WPT_GET_CHROME_TRACE_DATA';

export function wptGetChromeTraceData(options) {
    return function (dispatch) {
        wpt.getChromeTraceData(options.id, function (error, response) {
            dispatch({
                type: WPT_GET_CHROME_TRACE_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
