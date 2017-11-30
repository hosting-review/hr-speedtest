import wpt from '../../../wptPublic';

export const WPT_GET_SCREENSHOT_IMAGE = 'WPT_GET_SCREENSHOT_IMAGE';

export function wptGetScreenshotImage(property, params = {
    id: '',
    options: {
        thumbnail: false, // Boolean, returns the thumbnail of actual image
        dataURI: false, //Boolean, returns the base64 string representation (inline) of actual image
    }
}) {
    return function (dispatch) {
        wpt.getScreenshotImage(params.id, params.options, (error, response, info) => {
            dispatch({
                type: WPT_GET_SCREENSHOT_IMAGE,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
