import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Button } from 'material-ui';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmBox from './Confirm-box';
import ItemDetails from './ItemDetail';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    margin: {
        marginRight: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2
    },
    summary: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
    },
    details: {
        borderTop: 'solid 2px #DBE8F9'
    },
    toggle: {
        borderRadius: '100%',
        padding: '5px',
        '&:hover': {
            backgroundColor: '#3F51B5',
            color: '#FFFFFF'
        },
    }
});
class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemDetails: {},
            expansionPanelOpen: false
        }
        this.getItem = this.getItem.bind(this);
        this.expand = this.expand.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { item: oldItem } = prevProps;
        const { item: newItem } = this.props;
        if (oldItem.updated !== newItem.updated || oldItem.reminders.useDefault !== newItem.reminders.useDefault) {
            this.props.getItem(this.props.item.id).then(data => this.setState(...this.state, { itemDetails: data.event }));
        }
    }

    expand() {
        this.setState(...this.state, { expansionPanelOpen: !this.state.expansionPanelOpen })
    };

    getItem(id) {
        if (this.state.itemDetails.hasOwnProperty('id')) {
            return;
        }
        this.props.getItem(id).then(data => this.setState(...this.state, { itemDetails: data.event }));
    }

    render() {
        function deleteButton(props) { return (<Button {...props} className={classes.margin} variant="fab" mini={true}><DeleteIcon /></Button>) }
        const { item, classes, deleteItem } = this.props;
        const { itemDetails } = this.state;
        return (<ExpansionPanel key={item.id} expanded={this.state.expansionPanelOpen} onChange={() => this.getItem(item.id)}>
            <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMoreIcon className={classes.toggle} onClick={this.expand} />}>
                <Grid container spacing={24} alignItems='stretch'>
                    <Grid item={true} xs={12} sm={6} zeroMinWidth={true}>
                        <div className={classes.summary}>
                            <ConfirmBox
                                component={deleteButton}
                                onConfirmHandler={() => deleteItem(item.id)}
                                title="Confirm to delete this task?"
                                text="This deletion is permanent, to continue please press confirm."
                            />
                            <h3 className={classes.margin}>{item.summary}</h3>
                        </div>
                    </Grid>
                    <Grid item={true} xs={12} sm={3} zeroMinWidth={true}>
                        <p className={classes.margin}><strong>Due on</strong> {moment(item.start.dateTime).calendar()}</p>
                    </Grid>
                    <Grid item={true} xs={12} sm={3} zeroMinWidth={true}>
                        <p className={classes.margin}><strong>Created on</strong> {moment(item.created).calendar()}</p>
                    </Grid>
                </Grid>
                {/* </div> */}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <ItemDetails details={itemDetails} />
            </ExpansionPanelDetails>
        </ExpansionPanel>)
    }
};

Item.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Item);