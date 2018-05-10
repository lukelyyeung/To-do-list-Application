import axios from 'axios';
import { loadingAction, finishLoadingAction } from './Loading';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

// actions
export const LoginSuccessAction = () => ({ type: LOGIN_SUCCESS });
export const LogoutAction = () => ({ type: LOGOUT_SUCCESS });
export const LogoutFailAction = (message) => ({ type: LOGOUT_FAILURE, title: 'Logout failure', message });
export const LoginFailureAction = (message) => ({ type: LOGIN_FAILURE, title: 'Login failure', message });

// action creators
export const googleLogin = (code) => {
    return (dispatch) => {
        if (!code) {
            return dispatch(LoginFailureAction('Google login failure'))
        }
        dispatch(loadingAction());
        return axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_SERVER}/auth/google`,
            data: { code }
        })
        .then(({ data }) => {
            dispatch(finishLoadingAction());
            if (data.error) {
                return dispatch(LoginFailureAction(data.error));
            } else if (!data) {
                return dispatch(LoginFailureAction('Unknown Login Error.'));
            } else {
                const { token } = data;
                localStorage.setItem('token', JSON.stringify(token));
                return dispatch(LoginSuccessAction());
            }
        })
        .catch(response => {
                dispatch(finishLoadingAction());
                return dispatch(LoginFailureAction(response.message));
            });
    }
}

export const jwtLogin = () => {
    return (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            dispatch(loadingAction());
            return axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_SERVER}/auth/jwt`,
                headers: { Authorization: `Bearer ${JSON.parse(token)}` }
            })
                .then(response => {
                    dispatch(finishLoadingAction());
                    if (response.data.error) {
                        return dispatch(LoginFailureAction(response.data.error));
                    } else if (!response.data) {
                        return dispatch(LoginFailureAction('Unknown login error'));
                    } else {
                        return dispatch(LoginSuccessAction());
                    }
                })
                .catch(response => {
                    dispatch(finishLoadingAction());
                    return dispatch(LoginFailureAction(response.message));
                });
        } catch (err) {
            dispatch(finishLoadingAction());
            return dispatch(LoginFailureAction('Unknown login error'));
        }
    }
}

export const logout = () => {
    return (dispatch) => {
        try {
            dispatch(LogoutAction());
            localStorage.clear();
        } catch(err) {
            dispatch(LogoutFailAction('Fail to logout'));
        }
    }
}