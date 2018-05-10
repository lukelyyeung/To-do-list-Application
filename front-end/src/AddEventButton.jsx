import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import EventForm from './containers/PostEventForm';
import ModalFormButton from './ModalFormButton';
import moment from 'moment';

const styles = theme => ({
    floatButton: {
        margin: theme.spacing.unit,
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    }
});

let AddEventButton = ({ classes, onClick }) => (
    <Button
        variant="fab"
        color="primary"
        aria-label="add"
        className={`${classes.floatButton} add-button`}
        onClick={onClick}
    >
        <AddIcon />
    </Button>
)

AddEventButton = withStyles(styles)(AddEventButton);

export default () => {
    const initialValues = { start: moment().format('YYYY-MM-DD[T]HH:mm'), end: moment().format('YYYY-MM-DD[T]HH:mm') };
    return (
        <ModalFormButton
            initialValues={initialValues}
            actionType="Post"
            outputButton={AddEventButton}
            outputForm={EventForm}
            title="Post an event on Google Calendar" 
        />
    )
}