import moment from 'moment';

const isValidDate = date => {
    return !moment(date).isValid();
}

const isPassed = date => {
    const startTime = moment(date);
    const currentTime = moment();
    return startTime.isBefore(currentTime);
}

const isTimeTraveller = (start, due) => {
    const startTime = moment(start);
    const dueTime = moment(due);
    return dueTime.isBefore(startTime);
}

const validate = values => {
    const errors = {}
    const requiredFields = [
        'summary',
        'description',
        'start',
        'end'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    if (values.start && (isValidDate(values.start) || isPassed(values.start))) {
        errors.start = 'Invalid start date'
    }
    if (values.end && (isValidDate(values.end) || isPassed(values.end))) {
        errors.end = 'Invalid due date'
    }
    
    if (values.start && values.end && isTimeTraveller(values.start, values.end)) {
        errors.start = 'Time traveller?';
        errors.end = 'Time traveller?';
    }
    return errors
}

export default validate;