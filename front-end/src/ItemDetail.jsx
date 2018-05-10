import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import EditEventButton from './EditEventButton';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    infoBar: {
        backgroundColor: '#DBE8F9',
        height: 'calc(100% - 24px)',
    },
    breakWord: {
        wordWrap: 'break-word',
        marginTop: theme.spacing.unit
    },
    form: {
        width: '100%'
    },
    toolBar: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginLeft: theme.spacing.unit
    },
    label: {
        fontWeight: '700'
    }
});

const ItemDetails = (props) => {

    const calendarFomrat = (date) => moment(date).calendar();

    const { classes, details } = props;
    const initialValues = details.hasOwnProperty('id') ? {
        id: details.id,
        summary: details.summary,
        description: details.description,
        start: moment(details.start.dateTime).format('YYYY-MM-DD[T]HH:mm'),
        end: moment(details.end.dateTime).format('YYYY-MM-DD[T]HH:mm'),
        reminder: details.reminders.useDefault
    } : {};

    return details.hasOwnProperty('id') ? (
        <Grid container spacing={24} alignItems='stretch'>
            <Grid className={classes.info} item={true} xs={12} sm={12} zeroMinWidth={true} >
                <div className={`${classes.toolBar}`}>
                    <EditEventButton initialValues={initialValues} />
                    <a target="_blank" href={details.htmlLink} style={{ textDecoration: 'none' }}>
                        <Button color="secondary" variant="fab" className={classes.button} component="span">
                            <Icon>calendar_today</Icon>
                        </Button>
                    </a>
                </div>
            </Grid>
            <Grid item={true} xs={12} sm={6} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Summary:</label>
                    <Typography className={classes.breakWord}>{details.summary}</Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={12} sm={6} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Description:</label>
                    <Typography className={classes.breakWord}>{details.description}</Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Start on:</label>
                    <Typography className={classes.breakWord}>{calendarFomrat(details.start.dateTime)}</Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Due on:</label>
                    <Typography className={classes.breakWord}>{calendarFomrat(details.end.dateTime)}</Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Category:</label>
                    <Typography className={classes.breakWord}>
                        {details.kind.replace('calendar#', '').toUpperCase()}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Created by:</label>
                    <Typography className={classes.breakWord}>
                        {details.creator.email}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Created on:</label>
                    <Typography className={classes.breakWord}>{calendarFomrat(details.created)}</Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <label className={classes.label}>Last update on:</label>
                    <Typography className={classes.breakWord}>{calendarFomrat(details.updated)}</Typography>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <div style={{ display: 'flex', alignContent: 'center' }}>
                        <label className={classes.label}>Reminder:</label>
                        {details.reminders.useDefault ?
                            (<div><Icon>alarm_on</Icon></div>) :
                            (<div><Icon>alarm_off</Icon></div>)}
                    </div>
                </Paper>
            </Grid>
            <Grid item={true} xs={6} sm={3} zeroMinWidth={true}>
                <Paper className={`${classes.paper} ${classes.infoBar}`}>
                    <div style={{ display: 'flex', alignContent: 'center' }}>
                        <label className={classes.label}>Confirmed:</label>
                        {details.status === "confirmed" ?
                            (<div><Icon>check</Icon></div>) :
                            (<div><Icon>close</Icon></div>)}
                    </div>
                </Paper>
            </Grid>
        </Grid>) :
        null
}

export default withStyles(styles)(ItemDetails);