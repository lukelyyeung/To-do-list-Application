import React from 'react';
import Navigation from './Navigation';
import { Body } from './Body';
import AddEventButton from './AddEventButton';
import AlertBox from './containers/AlertBox';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Loading from './containers/Loading';

const App = () => (
    <Provider store={store}>
        <Router>
            <div>
                <Navigation />
                <Body />
                <AddEventButton/>
                <AlertBox />
                <Loading type="spinningBubbles" color="#fff"/>
            </div>
        </Router>
    </Provider>
);

export default App;