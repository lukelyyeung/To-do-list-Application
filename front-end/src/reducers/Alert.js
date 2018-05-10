import { LOGIN_FAILURE, } from '../actions/Auth';
import { GET_ITEMS_FAILURE } from '../actions/Items';
import { MANIPULATE_ITEM_FAILURE, POST_ITEM_SUCCESS, PATCH_ITEM_SUCCESS, DELETE_ITEM_SUCCESS } from '../actions/Item';
import { ALERT_DISMISS } from '../actions/Alert';

const initialState = { title: '', message: '', isAlert: false };

// reducer for global alert state
// Current design can only handle single alert at the same time
// Consider to change to array to store alert, shift the array when attaining maximum?

export default function AlertReducer(state = initialState, action) {
    switch (action.type) {

        // Dismiss the alert
        case ALERT_DISMISS: {
            return { title: '', message: '', isAlert: false }
        }
        // Turn on the alert
        case POST_ITEM_SUCCESS:
        case PATCH_ITEM_SUCCESS:
        case DELETE_ITEM_SUCCESS:
        case LOGIN_FAILURE:
        case MANIPULATE_ITEM_FAILURE:
        case GET_ITEMS_FAILURE: {
            return { title: action.title, message: action.message, isAlert: true }
        }
        default: {
            return state;
        }
    }
}