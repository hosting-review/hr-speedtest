import wpt from '../../../wptPublic';

export const WPT_GET_EMBED_VIDEO_PLAYER = 'WPT_GET_EMBED_VIDEO_PLAYER';

export function wptGetEmbedVideoPlayer(options) {
    return function (dispatch) {
        wpt.getEmbedVideoPlayer(options.id, function (error, response) {
            dispatch({
                type: WPT_GET_EMBED_VIDEO_PLAYER,
                payload: {
                    data: response,
                    error: error ? error : false
                }
            });
        });
    }
}
