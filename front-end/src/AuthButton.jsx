import * as React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { withStyles } from 'material-ui/styles';
const SCOPE = "https://www.googleapis.com/auth/calendar profile openid"

const styles = (theme) => ({
    logout: {
        color: '-webkit-link',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    margin: {
        margin: theme.spacing.unit,
    },
    google: {
        cursor: 'pointer',
        margin: 0,
        border: 0,
        display: 'inline-flex',
        outline: 'none',
        alignItems: 'center',
        borderRadius: 0,
        verticalAlign: 'middle',
        justifyContent: 'center',
        textDecoration: 'none',
        padding: '8px 16px',
        minWidth: '88px',
        boxSizing: 'border-box',
        minHeight: '36px',
        color: '#fff',
        fontFamily: "'Open Sans', 'sans-serif'",
        fontSize: '16px',
        backgroundColor: '#3F51B5',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        '&:hover': {
            backgroundColor: '#1F3195',
        },
    }
});

export const PureAuth = (props) => {

    const { classes, googleLogin, loginFail, logout } = props;
    const responseGoogle = (response) => {
        if (response.error || !response.code) {
            loginFail(response.error || 'Please try again');
        } else {
            googleLogin(response.code);
        }
    }

    const googleLogout = () => {
        logout();
    }


    if (props.isAuthenticated) {
        return (<GoogleLogout
            buttonText="Logout"
            tag="a"
            className={classes.logout}
            onLogoutSuccess={googleLogout}
        />);
    }
    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            responseType="code"
            accessType="offline"
            buttonText="Login"
            prompt="consent"
            tag="button"
            className={`${classes.google} ${classes.margin}`}
            style={styles.login}
            scope={SCOPE}
            onSuccess={responseGoogle}
            onFailure={loginFail}
        />)
}

export default withStyles(styles)(PureAuth);