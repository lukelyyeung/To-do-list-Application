import axios from 'axios';
import { getItemsFailure } from './Items';
import { loadingAction, finishLoadingAction } from './Loading';

// Actions
export const POST_ITEM_SUCCESS = 'POST_ITEM_SUCCESS';
export const PATCH_ITEM_SUCCESS = 'PATCH_ITEM_SUCCESS';
export const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
export const MANIPULATE_ITEM_FAILURE = 'MANIPULATE_ITEM_FAILURE';

// Actions creators
const postItemSuccess = (items) => ({
    type: POST_ITEM_SUCCESS,
    message: 'Create event successfully',
    title: 'Event notification',
    items
});
const patchItemSuccess = (items) => ({
    type: PATCH_ITEM_SUCCESS,
    message: 'Update event successfully',
    title: 'Event notification',
    items
});
const deleteItemSuccess = (items) => ({
    type: DELETE_ITEM_SUCCESS,
    message: 'Delete event successfully',
    title: 'Event notification',
    items
});
const manipulateItemFailure = (message) => ({ type: MANIPULATE_ITEM_FAILURE, message, title: 'Event operation fail' });

// Action Creators
const refreshItems = (token, dispatch, actionCreator) => (
    axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_SERVER}/calendar/primary/list?offset=0}`,
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
                return dispatch(actionCreator(response.data.events));
            }
        }))
    .catch(response => {
        dispatch(finishLoadingAction());
        return dispatch(manipulateItemFailure(response.message));
    })

export const postCalendarItem = (item) => {
    return (dispatch) => {

        const token = localStorage.getItem('token');
        if (!token) {
            return dispatch(manipulateItemFailure('Please log in again.'));
        }
        dispatch(loadingAction());
        return axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_SERVER}/calendar/primary`,
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            data: { resource: item }
        })
            .then(response => {
                if (response.error) {
                    return dispatch(manipulateItemFailure(response.error));
                } else if (!response.data) {
                    return dispatch(manipulateItemFailure('Unknown post item error.'));
                } else {
                    if (response.data.token) {
                        localStorage.setItem('token', JSON.stringify(response.data.token));
                    }
                    return refreshItems(token, dispatch, postItemSuccess);
                }
            })
            .catch(response => {
                dispatch(finishLoadingAction());
                return dispatch(manipulateItemFailure(response.message));
            })
    }
}

export const patchCalendarItem = (id, item) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return dispatch(manipulateItemFailure('Please log in again.'));
        }
        dispatch(loadingAction());
        return axios({
            method: 'patch',
            url: `${process.env.REACT_APP_API_SERVER}/calendar/primary/events/${id}`,
            headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            data: { resource: item }
        })
            .then(response => {
                if (response.error) {
                    return dispatch(manipulateItemFailure(response.error));
                } else if (!response.data) {
                    return dispatch(manipulateItemFailure('Unknown patch item error.'));
                } else {
                    if (response.data.token) {
                        localStorage.setItem('token', JSON.stringify(response.data.token));
                    }
                    return refreshItems(token, dispatch, patchItemSuccess);
                }
            })
            .catch(response => {
                dispatch(finishLoadingAction());
                return dispatch(manipulateItemFailure(response.message));
            })
    }
}

export const getCalendarItem = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return dispatch(manipulateItemFailure('Please log in again.'));
        }

        dispatch(loadingAction());
        return axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_SERVER}/calendar/primary/events/${id}`,
            headers: { Authorization: `Bearer ${JSON.parse(token)}` }
        })
            .then(response => {
                dispatch(finishLoadingAction());
                if (response.error) {
                    return dispatch(manipulateItemFailure(response.error));
                } else if (!response.data) {
                    return dispatch(manipulateItemFailure('Unknown get item error.'));
                } else {
                    if (response.data.token) {
                        localStorage.setItem('token', JSON.stringify(response.data.token));
                    }
                    return response.data;
                }
            })
            .catch(response => {
                dispatch(finishLoadingAction());
                return dispatch(manipulateItemFailure(response.message));
            })
    }
}

export const deleteCalendarItem = (id) => {
    return (dispatch) => {

        const token = localStorage.getItem('token');
        if (!token) {
            return dispatch(manipulateItemFailure('Please log in again.'));
        }

        dispatch(loadingAction());
        return axios({
            method: 'delete',
            url: `${process.env.REACT_APP_API_SERVER}/calendar/primary/events/${id}`,
            headers: { Authorization: `Bearer ${JSON.parse(token)}` }
        })
            .then(response => {
                if (response.error) {
                    return dispatch(manipulateItemFailure(response.error));
                } else if (!response.data) {
                    return dispatch(manipulateItemFailure('Unknown delete item error.'));
                } else {
                    if (response.data.token) {
                        localStorage.setItem('token', JSON.stringify(response.data.token));
                    }

                    return refreshItems(token, dispatch, deleteItemSuccess);
                }
            })
            .catch(response => {
                dispatch(finishLoadingAction());
                return dispatch(manipulateItemFailure(response.message));
            })
    }
}
