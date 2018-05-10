import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    raisedButton: {
        marginRight: theme.spacing.unit / 2,
        marginTop: theme.spacing.unit / 2,
        fontSize: theme.spacing.unit * 2,
        position: 'absolute',
        top: theme.spacing.unit / 2,
        right: theme.spacing.unit / 2
    },
    paper: {
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 6,
    },
});

class ModalFormButton extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    render() {
        const { classes, title, outputButton: OutputButton, outputForm: OutputForm, initialValues, actionType } = this.props;

        return (
            <div>
                <OutputButton onClick={this.handleOpen} />
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Button color="secondary" variant="fab" mini className={classes.raisedButton} onClick={this.handleClose}>
                            <Icon>close</Icon>
                        </Button>
                        <Typography variant="title" id="modal-title">
                            {title}
                        </Typography>
                        <OutputForm initialValues={initialValues} actionType={actionType} handleClose={this.handleClose} handleSubmit={this.handleSubmit} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(ModalFormButton);