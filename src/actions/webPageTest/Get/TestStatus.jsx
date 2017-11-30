import wpt from '../../../wptPublic';

export const WPT_GET_TEST_STATUS = 'WPT_GET_TEST_STATUS';


/**
 *
 * @param property
 * @param params
 * @returns {Function}
 */

export function wptTestStatus(property, params) {
    return function (dispatch) {
        wpt.getTestStatus(params.id, (error, response) => {
                dispatch({
                    type: WPT_GET_TEST_STATUS,
                    payload: {
                        data: response,
                        error: error ? error : false
                    }
                });
        });
    }
}
