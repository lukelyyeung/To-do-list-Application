import React from 'react';
import ReactLoading from 'react-loading';
import { withStyles } from 'material-ui/styles';

const Styles = theme => ({
    loadingContainer: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        height: theme.spacing.unit * 15,
        width: theme.spacing.unit * 15,
        backgroundColor: 'rgba(63, 81, 181, 1)',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    } 
});

const Loading = ({ classes, isLoading, type, color }) => (
    isLoading ?
        (<div className={classes.loadingContainer}>
            <ReactLoading type={type} color={color} />
        </div>)
        : null
);

export default withStyles(Styles)(Loading);