import wpt from '../../../wptPublic';

export const WPT_GET_TEST_RESULTS = 'WPT_GET_TEST_RESULTS';

export function wptGetTestResults(options) {
    return function (dispatch) {
        wpt.getTestResults(options.id, (error, response) => {
            dispatch({
                type: WPT_GET_TEST_RESULTS,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
