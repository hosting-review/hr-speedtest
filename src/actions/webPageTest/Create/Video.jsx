import wpt from '../../../wptPublic';

export const WPT_CREATE_VIDEO = 'WPT_CREATE_VIDEO';

export function wptCreateVideo(options) {
    return function (dispatch) {
        wpt.createVideo(options.id, (error, response) => {
            dispatch({
                type: WPT_CREATE_VIDEO,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
