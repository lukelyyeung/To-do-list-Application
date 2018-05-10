import React from 'react';
import { Field } from 'redux-form';
import { submit } from 'redux-form'
import Button from 'material-ui/Button';
import { renderCheckbox, renderDatePicker, renderTextField } from './renderForm/renderInput';
import { withStyles } from 'material-ui/styles';
import ConfirmBox from './Confirm-box';

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    noMargin: {
        margin: '0'
    },
    field: {
        width: '100%'
    },
    fieldContainer: {
        margin: '10px 0 0',
    }
})

const SubmitButton = ({ onClick, ...others }) => (
    <Button onClick={onClick} {...others} color="primary" variant="raised" type="button">
        Submit
    </Button>
);

const EventForm = props => {
    const { handleSubmit, invalid, classes, handleClose, pristine, reset, submitting, dispatch, actionType } = props;
    const triggerSubmit = () => {
        return (() => new Promise((resolve, reject) => {
            dispatch(submit('eventForm'));
            resolve();
        }))()
            .then(() => handleClose());
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={classes.fieldContainer}>
                <Field
                    className={classes.field}
                    name="summary"
                    component={renderTextField}
                    label="Summary"
                />
            </div>
            <div className={classes.fieldContainer}>
                <Field
                    className={classes.field}
                    name="description"
                    component={renderTextField}
                    label="Description"
                />
            </div>
            <div className={classes.fieldContainer}>
                <Field
                    className={`${classes.noMargin} ${classes.field}`}
                    component={renderDatePicker}
                    name="start"
                    label="Start Date" />
            </div>
            <div className={classes.fieldContainer}>
                <Field
                    className={`${classes.noMargin} ${classes.field}`}
                    component={renderDatePicker}
                    name="end"
                    label="Due Date" />
            </div>
            <div className={classes.fieldContainer}>
                <Field
                    className={`${classes.noMargin} ${classes.field}`}
                    component={renderCheckbox}
                    name="reminder"
                    label="Reminder"
                />
            </div>
            <div>
                <ConfirmBox
                    onConfirmHandler={() => triggerSubmit()}
                    title={`${actionType} this event?`}
                    text="Make sure the details are correct!"
                    disabled={pristine || submitting || invalid}
                    className={classes.button}
                    component={SubmitButton}
                />
                <Button className={classes.button} type="button" color="secondary" variant="raised" disabled={pristine || submitting} onClick={reset}>
                    Clear Values
                </Button>
            </div>
        </form>
    )
}

export default (withStyles(styles)(EventForm));