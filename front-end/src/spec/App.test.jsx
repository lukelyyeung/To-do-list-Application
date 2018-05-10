import * as React from 'react';
import { store } from '../store';
import App from '../App';
import Navigation from '../Navigation';
import AuthButton from '../containers/AuthButton';
import Item from '../Item';
import Items from '../containers/Items';
import PostEventForm from '../containers/PostEventForm';
import EventForm from '../EventForm';
import ModalFormButton from '../ModalFormButton';
import AddEventButton from '../AddEventButton';
import { shallow, mount } from 'enzyme';
import { LoginSuccessAction } from '../actions/Auth';
import { getItemsSuccess } from '../actions/Items';
import { Provider } from 'react-redux';

describe('<App />', () => {

    const event = {
        id: '1',
        summary: '',
        description: '',
        reminders: {
            useDefault: true
        },
        start: {
            dateTime: '2018-04-24'
        },
        end: {
            dateTime: '2018-04-24'
        }
    }

    it('renders a <App /> components', () => {
        const wrapper = mount(<App />);
        expect(wrapper.find('header').length).toEqual(1);
    });
    it('renders a navigation bar', () => {
        const wrapper = mount(<App />);
        expect(wrapper.find(Navigation).length).toEqual(1);
    });
    it('renders a login button', () => {
        const wrapper = mount(<App />);
        expect(wrapper.find(AuthButton).length).toEqual(1);
    });
    it('renders a addEvent button', () => {
        const wrapper = mount(<App />);
        expect(wrapper.find(AddEventButton).length).toEqual(1);
    });
});