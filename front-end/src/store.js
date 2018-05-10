import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/Auth';
import ItemsReducer from './reducers/Items';
import LoadingReducer from './reducers/Loading';
import { reducer as formReducer } from 'redux-form'
import AlertReducer from './reducers/Alert';

export const store = createStore(
    combineReducers({
        auth: authReducer,
        items: ItemsReducer,
        alert: AlertReducer,
        loading: LoadingReducer,
        form: formReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(ReduxThunk)
);