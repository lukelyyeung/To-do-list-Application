import { connect } from 'react-redux';
import Item from '../Item';
import { getCalendarItem, deleteCalendarItem } from '../actions/Item';

const mapDispatchToPorps = dispatch => ({
    getItem: (id) => dispatch(getCalendarItem(id)),
    deleteItem: (id, item) => dispatch(deleteCalendarItem(id))
});

export default connect(null, mapDispatchToPorps)(Item);