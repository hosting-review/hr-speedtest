import wpt from '../../../wptPublic';

export const WPT_GET_CONSOLE_LOG_DATA = 'WPT_GET_CONSOLE_LOG_DATA';

export function wptGetConsoleLogData(options) {
    return function (dispatch) {
        wpt.getConsoleLogData(options.id, function (error, response) {
            dispatch({
                type: WPT_GET_CONSOLE_LOG_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
