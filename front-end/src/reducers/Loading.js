import { LOADING, FINISH_LOADING } from "../actions/Loading";

export default function LoadingReducer(state = false, action) {
    switch (action.type) {
        case LOADING: return true;
        case FINISH_LOADING: return false;
        default: {
            return state;
        }
    }
}