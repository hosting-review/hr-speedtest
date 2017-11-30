import wpt from '../../wptPublic';

export const WPT_SCRIPT_TO_STRING = 'WPT_SCRIPT_TO_STRING';

export function wptScriptToString(scripts = []) {
    return function (dispatch) {
        wpt.listen(scripts, function (error, { response }) {
            dispatch({
                type: WPT_SCRIPT_TO_STRING,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
