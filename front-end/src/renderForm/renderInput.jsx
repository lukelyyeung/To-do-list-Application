import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DateTimePicker from './DateTimePicker';

export const renderTextField = ({
    input,
    label,
    meta: { touched, error, warning },
    ...custom
}) => (
        <div>
            <TextField
                label={label}
                {...input}
                {...custom}
                error={Boolean(touched && error)}
            />
            {touched &&
                ((error && <span>{error}</span>) ||
                    (warning && <span>{warning}</span>))}
        </div>
    );

export const renderDatePicker = ({
    input,
    label,
    meta,
    ...custom
}) => (
        <DateTimePicker
            label={label}
            input={input}
            meta={meta}
            custom={custom}
        />
    );

export const renderCheckbox = ({ input, label, meta, ...custom }) => (
    <div {...custom}>
        <Checkbox
            checked={input.value ? true : false}
            onChange={input.onChange}
        />
        <label>{label}</label>
    </div>
);