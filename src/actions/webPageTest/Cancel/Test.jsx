import {apiKey} from '../../../wptPublic';
import axios from 'axios';

export const WPT_CANCEL_TEST = 'WPT_CANCEL_TEST';

export function wptCancelTest(property, params) {
    return function (dispatch) {
        axios.get(`${global.location.protocol}//www.webpagetest.org/cancelTest.php?test=${params.id}&k=${apiKey}&f=json`)
            .then(response => {
                dispatch({
                    type: WPT_CANCEL_TEST,
                    payload: /Test cancelled/ig.test(response.data)
                });
            }).catch(error => console.log(error));
    }
}
