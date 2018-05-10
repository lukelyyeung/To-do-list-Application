import React from 'react';
import Item from './containers/Item';

export const ItemList = (props) => {
    const { items } = props;
    return (
        <div>
            <h3>{items.length} items in to-do-list</h3>
            {items.map(item => <Item key={item.id} item={item} />)}
        </div>);
}

export default ItemList;