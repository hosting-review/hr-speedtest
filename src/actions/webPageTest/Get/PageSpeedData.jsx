import wpt from '../../../wptPublic';

export const WPT_GET_PAGE_SPEED_DATA = 'WPT_GET_PAGE_SPEED_DATA';

export function wptGetPageSpeedData(property, params) {
    return function (dispatch) {
        wpt.getPageSpeedData(params.id, params.options, (error, response) => {
            dispatch({
                type: WPT_GET_PAGE_SPEED_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
