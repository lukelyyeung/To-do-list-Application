import React from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { withStyles } from "material-ui";
import ModalFormButton from './ModalFormButton';
import EventForm from './containers/UpdateEventForm';
import orange from 'material-ui/colors/orange';

const styles = (theme) => ({
    editButton: {
        backgroundColor: orange[400],
        color: '#fff',
        marginLeft: theme.spacing.unit, 
        '&:hover': {
            backgroundColor: orange[700],
        }
    }
});

let EditEventButton = ({ classes, onClick }) => (
    <Button
        variant="fab"
        className={classes.editButton}
        aria-label="add"
        onClick={onClick}
    >
        <Icon>edit_icon</Icon>
    </Button>);

EditEventButton = withStyles(styles)(EditEventButton);

export default ({initialValues}) => (
    <ModalFormButton 
        initialValues={initialValues}
        actionType="Update"
        outputButton={EditEventButton}
        outputForm={EventForm}
        title="Update this event?"
    />);