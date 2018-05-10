import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import EventForm from '../EventForm';
import validate from '../renderForm/EventFormValidate';
import { patchCalendarItem } from '../actions/Item';

const remoteSubmit = (formValues, dispatch) => {
    const event = {
        summary: formValues.summary,
        description: formValues.description,
        start: {
            dateTime: moment(formValues.start, moment.ISO_8601)
        },
        end: {
            dateTime: moment(formValues.end, moment.ISO_8601)
        },
        reminders: {
            useDefault: formValues.reminder
        }
    }
    return dispatch(patchCalendarItem(formValues.id, event));
}

export default connect()(reduxForm({
    form: 'eventForm',
    validate,
    onSubmit: remoteSubmit
})(EventForm));