import wpt from '../../../wptPublic';

export const WPT_GET_UTILIZATION_DATA = 'WPT_GET_UTILIZATION_DATA';

export function wptGetUtilizationData(options) {
    return function (dispatch) {
        wpt.getUtilizationData(options.id, (error, response) => {
            dispatch({
                type: WPT_GET_UTILIZATION_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
