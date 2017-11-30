import wpt from '../../../wptPublic';

export const WPT_GET_GOOGLE_CSI_DATA = 'WPT_GET_GOOGLE_CSI_DATA';

export function wptGetGoogleCsiData(options) {
    return function (dispatch) {
        wpt.getGoogleCsiData(options.id, function (error, response) {
            dispatch({
                type: WPT_GET_GOOGLE_CSI_DATA,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
