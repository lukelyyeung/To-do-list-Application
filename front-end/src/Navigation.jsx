import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import AuthButton from './containers/AuthButton';
import { jwtLogin } from './actions/Auth';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 10,
    },
    navLink: {
        textDecoration: 'none',
        display: 'block',
        width: '100%',
        height: '100%'
    },
    accountIcon: {
        width: '1.5em',
        height: '1.5em'
    }
};

class Navigation extends React.Component {

    state = { anchorEl: null };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    componentDidMount() {
        this.props.jwtLogin();
    }

    render() {
        const { classes, isAuthenticated } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (<div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        To-Do-List Application
                        </Typography>
                    {!isAuthenticated && <AuthButton />}
                    {isAuthenticated && (
                        <div>
                            <IconButton
                                className={classes.menuButton}
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle className={classes.accountIcon} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <Link className={classes.navLink} to="/items"><MenuItem>Items</MenuItem></Link>
                                <MenuItem ><AuthButton /></MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>);
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });
const mapDispatchToPorps = dispatch => ({
    jwtLogin: () => dispatch(jwtLogin())
});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToPorps)(Navigation));
