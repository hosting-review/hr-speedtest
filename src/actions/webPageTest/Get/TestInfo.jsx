import wpt from '../../../wptPublic';

export const WPT_GET_TEST_INFO = 'WPT_GET_TEST_INFO';

export function wptGetTestInfo(options) {
    return function (dispatch) {
        wpt.getTestInfo(options.id, (error, response) => {
            dispatch({
                type: WPT_GET_TEST_INFO,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
