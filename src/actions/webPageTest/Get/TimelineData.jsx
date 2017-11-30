import wpt from '../../../wptPublic';

export const WPT_GET_TIMELINE_DATA = 'WPT_GET_TIMELINE_DATA';

export function wptGetTimelineData(options) {
    return function (dispatch) {
        wpt.getTimelineData(options.id, (error, response) => {
            dispatch({
                type: WPT_GET_TIMELINE_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}

