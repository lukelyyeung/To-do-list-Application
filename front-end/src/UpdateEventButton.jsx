import React from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { withStyles } from "material-ui";
import ModalFormButton from './ModalFormButton';
import EventForm from './containers/UpdateEventForm';
import orange from 'material-ui/colors/orange';

const styles = (theme) => ({
    updateButton: {
        backgroundColor: orange[400],
        color: '#fff',
        marginLeft: theme.spacing.unit, 
        '&:hover': {
            backgroundColor: orange[700],
        }
    }
});

// Connect custom button with the update event form 
let UpdateEventButton = ({ classes, onClick }) => (
    <Button
        variant="fab"
        className={`${classes.updateButton} update-button`}
        aria-label="add"
        onClick={onClick}
    >
        <Icon>edit_icon</Icon>
    </Button>);

UpdateEventButton = withStyles(styles)(UpdateEventButton);

export default ({initialValues}) => (
    <ModalFormButton 
        initialValues={initialValues}
        actionType="Update"
        outputButton={UpdateEventButton}
        outputForm={EventForm}
        title="Update this event?"
    />);