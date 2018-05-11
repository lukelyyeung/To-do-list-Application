// import * as React from 'react';
// // import { store } from '../store';
// import Items from '../containers/ItemList';
// import { shallow, mount, createMockStore } from 'enzyme';
// import shallowWithStore from './shallowStore';
// import { getItemsSuccess } from '../actions/Items';

// describe('<App />', () => {

//     const event = {
//         id: '1',
//         summary: '',
//         description: '',
//         reminders: {
//             useDefault: true
//         },
//         start: {
//             dateTime: '2018-04-24'
//         },
//         end: {
//             useDefault: true
//         },
//         start: {
//             dateTime: '2018-04-24'
//         },
//         end: {
//             dateTime: '2018-04-24'
//         }
//     }

//     it('renders a <App /> components', () => {
//         const testState = {
//             items: []
//         };
//         const store = createMockStore(testState);
//         const wrapper = shallowWithStore(<Items />, store);
//         store.dispatch(getItemsSuccess([event]));
//         console.log(store.getState());
//     });

// });