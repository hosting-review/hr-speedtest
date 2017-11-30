import wpt from '../../../wptPublic';

export const WPT_GET_LOCATIONS = 'WPT_GET_LOCATIONS';

export function wptGetLocations(options) {
    return function (dispatch) {
        wpt.getLocations({ protocol: 'http' }, function (error, { response }) {
            const { data/*, statusCode, statusText*/ } = response;
            const { location } = data;

            dispatch({
                type: WPT_GET_LOCATIONS,
                payload: {
                    data: location,
                    error: error ? error : false
                }
            });
        });
    }
}
