import React from 'react';
import { connect } from 'react-redux';
import { dismissAlertAction } from '../actions/Alert';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const AlertBox = (props) => {
    const { isAlert, title, message, dismissTrigger } = props;
    return (
        <Dialog
            open={isAlert}
            TransitionComponent={Transition}
            keepMounted
            onClose={dismissTrigger}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">
                {title || ''}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={dismissTrigger} color="primary">
                    Dismiss
            </Button>
            </DialogActions>
        </Dialog>);
};

const mapStateToProps = (state) => ({
    isAlert: state.alert.isAlert,
    message: state.alert.message,
    title: state.alert.title
});

const mapDispatchToProps = dispatch => ({
    dismissTrigger: () => dispatch(dismissAlertAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertBox);