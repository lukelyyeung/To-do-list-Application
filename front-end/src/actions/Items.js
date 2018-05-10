import axios from 'axios';
import { loadingAction, finishLoadingAction } from './Loading';

export const GET_ITEMS_SUCCESS = 'GET_ITEMS_SUCCESS';
export const GET_ITEMS_FAILURE = 'GET_ITEMS_FAILURE';

// Actions
export const getItemsSuccess = (items) => ({ type: GET_ITEMS_SUCCESS, items });
export const getItemsFailure = (message) => ({ type: GET_ITEMS_FAILURE, message, title: 'Get item list fail' });

// Action Creators
export const getCalendarItems = (offset = 0) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        dispatch(loadingAction());
        return axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_SERVER}/calendar/primary/list?offset=${offset}`,
            headers: { Authorization: `Bearer ${JSON.parse(token)}` }
        })
        .then(response => {
                dispatch(finishLoadingAction());
                if (response.error) {
                    return dispatch(getItemsFailure(response.error));
                } else if (!response.data) {
                    return dispatch(getItemsFailure('Unknown get items error.'));
                } else {
                    if (response.data.token) {
                        localStorage.setItem('token', JSON.stringify(response.data.token));
                    }
                    if (response.data.events.length === 0) {
                        dispatch(getItemsFailure('Currently no upcoming events in this calendar'));
                    }
                    return dispatch(getItemsSuccess(response.data.events));
                }
            })
            .catch(response => {
                dispatch(finishLoadingAction());
                return dispatch(getItemsFailure(response.message));
            })
    }
}
