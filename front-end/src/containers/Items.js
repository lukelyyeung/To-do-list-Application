import React from 'react';
import { connect } from 'react-redux'
import ItemList from '../ItemList';
import { getCalendarItems } from '../actions/Items';
import { deleteCalendarItem } from '../actions/Item';

class ItemListContainer extends React.Component {

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.props.getCalendarItems();
        }
        return;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isAuthenticated === false && this.props.isAuthenticated === true) {
            this.props.getCalendarItems();
        }
        return;
    }

    render() {
        const { items, deleteCalendarItem } = this.props;
        return <ItemList
            items={items}
            deleteItem={deleteCalendarItem}
        />
    }
}

const mapStateToProps = state => ({ items: state.items, isAuthenticated: state.auth.isAuthenticated });
const mapDispatchToPorps = dispatch => ({
    getCalendarItems: () => dispatch(getCalendarItems()),
    deleteCalendarItem: (id) => dispatch(deleteCalendarItem(id))
});

export default connect(mapStateToProps, mapDispatchToPorps)(ItemListContainer);