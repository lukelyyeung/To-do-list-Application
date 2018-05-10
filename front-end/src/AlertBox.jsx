import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

const Transition = (props) => (<Slide direction="up" {...props} />)

const AlertBox = (props) => {
    const { isAlert, title, message, dismissTrigger } = props;
    return (
        <Dialog
            className="alert-box"
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

export default AlertBox;