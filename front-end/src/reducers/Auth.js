import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from '../actions/Auth';

const initialState = { isAuthenticated: false };

// reducer for global authentication state
export default function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS: {
            return { isAuthenticated: true }
        }
        case LOGIN_FAILURE: {
            return { isAuthenticated: false }
        }
        case LOGOUT_SUCCESS: {
            return { isAuthenticated: false }
        }
        default: {
            return state;
        }
    }
}