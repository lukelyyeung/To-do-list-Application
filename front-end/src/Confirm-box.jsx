import React from 'react';
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

class ConfirmBox extends React.Component {
    state = {
        isOpen: false
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    confirm = async () => {
        await this.props.onConfirmHandler()
    }

    render() {
        const { component: Component, text, title, onConfirmHandler, ...others } = this.props;
        return (<div style={{ display: 'inline-block' }}>
            {Component && <Component onClick={this.toggle} {...others} />}
            <Dialog
                open={Component ? this.state.isOpen: true}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggle} color="primary">
                        Dismiss
                        </Button>
                    {onConfirmHandler && (
                        <Button onClick={this.confirm} color="primary">
                            Confirm
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>)
    }
}

export default ConfirmBox;