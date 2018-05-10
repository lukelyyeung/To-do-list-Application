import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

const DateAndTimePickers = (props) => {
  const { classes, label, input, meta: { error, touched, warning }, custom } = props;
  return (
    <div>
      <TextField
        id="datetime-local"
        type="datetime-local"
        className={classes.textField}
        InputLabelProps={{ shrink: true }}
        label={label}
        error={Boolean(touched && error)}
        {...input}
        {...custom}
      />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  );
}

DateAndTimePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateAndTimePickers);