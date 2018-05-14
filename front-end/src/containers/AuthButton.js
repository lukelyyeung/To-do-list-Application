import { connect } from 'react-redux';
import { googleLogin, logout, LoginFailureAction } from '../actions/Auth';
import PureAuth from '../AuthButton';

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });
const mapDispatchToPorpss = dispatch => ({
    logout: () => dispatch(logout()),
    googleLogin: (code) => dispatch(googleLogin(code)),
    loginFail: (message) => dispatch(LoginFailureAction(message))
});

export default connect(mapStateToProps, mapDispatchToPorpss)(PureAuth);