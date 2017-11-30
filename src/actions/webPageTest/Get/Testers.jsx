import wpt from '../../../wptPublic';

export const WPT_GET_TESTERS = 'WPT_GET_TESTERS';

export function wptGetTesters(property, options) {
    return function (dispatch) {
        wpt.getTesters(options, function (error, response) {
            const { data/*, statusCode, statusText*/ } = response.response;
            dispatch({
                type: WPT_GET_TESTERS,
                payload: {
                    data: data.location.filter(testersLocation => testersLocation.id === options.id)[0].testers.tester,
                    error: error ? error : false
                }
            });
        });
    }
}
